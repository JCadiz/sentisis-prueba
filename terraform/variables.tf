variable "aws_region" {
  description = "Región de AWS donde se crearán los recursos"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Ambiente (dev, staging, production)"
  type        = string
  default     = "production"
}

variable "instance_type" {
  description = "Tipo de instancia EC2 (t2.micro es gratis en free tier)"
  type        = string
  default     = "t2.micro"
}

variable "app_name" {
  description = "Nombre de tu aplicación"
  type        = string
  default     = "sentisis-test"
}

variable "app_port" {
  description = "Puerto donde corre tu aplicación"
  type        = number
  default     = 3000
}

variable "mongodb_uri" {
  description = "URI de conexión a MongoDB Atlas"
  type        = string
  sensitive   = true # Esto evita que se muestre en los logs
}

variable "allowed_ssh_cidr" {
  description = "IPs que pueden conectarse por SSH (usa tu_ip/32 para mayor seguridad)"
  type        = list(string)
  default     = ["0.0.0.0/0"] # 0.0.0.0/0 significa "desde cualquier IP"
}

variable "allowed_api_cidr" {
  description = "IPs que pueden acceder a tu API"
  type        = list(string)
  default     = ["0.0.0.0/0"] # Público para que cualquiera pueda usar tu API
}

variable "github_repo_url" {
  description = "URL del repositorio de GitHub para clonar (ejemplo: https://github.com/usuario/repo.git)"
  type        = string
}

variable "github_branch" {
  description = "Rama del repositorio a deployar"
  type        = string
  default     = "master"
}
