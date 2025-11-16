# Configuración de Terraform y los proveedores que usaremos
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0" # Usamos la versión 5.x de AWS
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0" # Para generar las llaves SSH
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0" # Para guardar archivos en tu máquina
    }
  }
}

# Configuración del proveedor de AWS
provider "aws" {
  region = var.aws_region

  # Tags por defecto que se aplicarán a todos los recursos
  default_tags {
    tags = {
      Project     = "Sentisis-Test"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
