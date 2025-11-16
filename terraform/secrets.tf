# Aquí guardamos las credenciales de MongoDB de forma segura usando AWS Secrets Manager
# Es como una bóveda encriptada donde solo tu servidor puede acceder

# Crea la "caja fuerte" donde se guardará la URI de MongoDB
resource "aws_secretsmanager_secret" "mongodb_uri" {
  name        = "${var.app_name}-${var.environment}-mongodb-uri"
  description = "Cadena de conexión a MongoDB Atlas para ${var.app_name}"

  tags = merge(local.common_tags, {
    Name = "${var.app_name}-mongodb-secret"
  })
}

# Guarda el valor real de la URI dentro del secreto
resource "aws_secretsmanager_secret_version" "mongodb_uri" {
  secret_id     = aws_secretsmanager_secret.mongodb_uri.id
  secret_string = var.mongodb_uri
}

# Política de permisos: define QUÉ puede leer el servidor
resource "aws_iam_policy" "secrets_access" {
  name        = "${var.app_name}-${var.environment}-secrets-policy"
  description = "Permite que EC2 lea el secreto de MongoDB"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret"
        ]
        Resource = aws_secretsmanager_secret.mongodb_uri.arn
      }
    ]
  })
}

# Rol IAM: la "identidad" que tendrá tu servidor EC2
resource "aws_iam_role" "ec2_role" {
  name = "${var.app_name}-${var.environment}-ec2-role"

  # Esto permite que instancias EC2 usen este rol
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = merge(local.common_tags, {
    Name = "${var.app_name}-ec2-role"
  })
}

# Conecta la política de permisos con el rol
resource "aws_iam_role_policy_attachment" "secrets_access" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = aws_iam_policy.secrets_access.arn
}

# Instance profile: es como un "contenedor" que le asigna el rol a la instancia EC2
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.app_name}-${var.environment}-ec2-profile"
  role = aws_iam_role.ec2_role.name

  tags = merge(local.common_tags, {
    Name = "${var.app_name}-ec2-profile"
  })
}
