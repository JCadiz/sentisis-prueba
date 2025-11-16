output "instance_id" {
  description = "ID de tu instancia EC2"
  value       = aws_instance.app_server.id
}

output "instance_public_ip" {
  description = "IP pública del servidor (úsala para conectarte)"
  value       = aws_instance.app_server.public_ip
}

output "instance_public_dns" {
  description = "DNS público del servidor"
  value       = aws_instance.app_server.public_dns
}

output "api_url" {
  description = "URL completa para acceder a tu API"
  value       = "http://${aws_instance.app_server.public_ip}:${var.app_port}"
}

output "ssh_command" {
  description = "Comando para conectarte por SSH (cópialo y pégalo)"
  value       = "ssh -i ${var.app_name}-key.pem ubuntu@${aws_instance.app_server.public_ip}"
}

output "ssh_key_location" {
  description = "Ubicación de tu llave SSH privada"
  value       = "${path.module}/${var.app_name}-key.pem"
}

output "security_group_id" {
  description = "ID del firewall (security group)"
  value       = aws_security_group.app_sg.id
}

output "secrets_manager_arn" {
  description = "ARN del secreto de MongoDB en AWS Secrets Manager"
  value       = aws_secretsmanager_secret.mongodb_uri.arn
}

output "secrets_manager_name" {
  description = "Nombre del secreto de MongoDB (úsalo para consultar el valor)"
  value       = aws_secretsmanager_secret.mongodb_uri.name
}

output "iam_role_name" {
  description = "Nombre del rol IAM del servidor"
  value       = aws_iam_role.ec2_role.name
}
