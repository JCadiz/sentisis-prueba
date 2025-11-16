# Tags que vamos a usar en todos los recursos para mantener orden
locals {
  common_tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
    Project     = "Sentisis-Test"
  }
}

# Busca la imagen de Ubuntu más reciente para la instancia EC2
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # ID oficial de Canonical (los que hacen Ubuntu)

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Genera un par de llaves SSH para conectarte al servidor
resource "tls_private_key" "ssh_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "deployer" {
  key_name   = "${var.app_name}-key"
  public_key = tls_private_key.ssh_key.public_key_openssh

  tags = {
    Name = "${var.app_name}-ssh-key"
  }
}

# Guarda la llave privada en tu máquina para poder usarla con SSH
resource "local_file" "private_key" {
  content         = tls_private_key.ssh_key.private_key_pem
  filename        = "${path.module}/${var.app_name}-key.pem"
  file_permission = "0600"
}

# Firewall (Security Group) que controla quién puede acceder al servidor
resource "aws_security_group" "app_sg" {
  name        = "${var.app_name}-sg"
  description = "Firewall para ${var.app_name}"

  # Permite conexiones SSH solo desde tu IP
  ingress {
    description = "SSH para administración"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ssh_cidr
  }

  # Permite acceso a tu API desde cualquier lugar
  ingress {
    description = "API de la aplicación"
    from_port   = var.app_port
    to_port     = var.app_port
    protocol    = "tcp"
    cidr_blocks = var.allowed_api_cidr
  }

  # Permite que el servidor se conecte a internet (para updates, docker, etc)
  egress {
    description = "Salida a internet"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.app_name}-security-group"
  }
}

# Tu servidor EC2 donde corre la aplicación
resource "aws_instance" "app_server" {
  ami                  = data.aws_ami.ubuntu.id
  instance_type        = var.instance_type
  key_name             = aws_key_pair.deployer.key_name
  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name

  vpc_security_group_ids = [aws_security_group.app_sg.id]

  # Script que se ejecuta cuando arranca el servidor por primera vez
  user_data = templatefile("${path.module}/user-data.sh", {
    app_name            = var.app_name
    app_port            = var.app_port
    mongodb_uri         = var.mongodb_uri
    aws_region          = var.aws_region
    secret_name         = aws_secretsmanager_secret.mongodb_uri.name
    use_secrets_manager = true
    github_repo_url     = var.github_repo_url
    github_branch       = var.github_branch
  })

  # Disco duro de 20GB (suficiente para la app y Docker)
  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  tags = {
    Name = "${var.app_name}-server"
  }

  # Imprime un mensaje cuando la instancia esté lista
  provisioner "local-exec" {
    command = "echo 'Servidor listo en la IP: ${self.public_ip}'"
  }
}
