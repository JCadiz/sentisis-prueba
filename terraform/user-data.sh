#!/bin/bash
set -e

# Guarda todo lo que pase en este script en un log para debugging
exec > >(tee /var/log/user-data.log)
exec 2>&1

echo "Iniciando configuración del servidor..."

# Actualiza el sistema operativo
apt-get update
apt-get upgrade -y

# Instala las herramientas que necesitamos
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    awscli \
    jq

# Instala Docker (donde correrá tu aplicación)
echo "Instalando Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Arranca Docker y configúralo para que inicie automáticamente
systemctl start docker
systemctl enable docker

# Permite que el usuario ubuntu use Docker sin sudo
usermod -aG docker ubuntu

# Crea la carpeta donde vivirá tu aplicación
mkdir -p /home/ubuntu/app
cd /home/ubuntu/app

# Obtiene la URI de MongoDB desde AWS Secrets Manager (más seguro)
%{ if use_secrets_manager }
echo "Obteniendo credenciales de MongoDB desde Secrets Manager..."
MONGODB_URI_SECRET=$(aws secretsmanager get-secret-value \
    --secret-id ${secret_name} \
    --region ${aws_region} \
    --query SecretString \
    --output text)
%{ else }
MONGODB_URI_SECRET="${mongodb_uri}"
%{ endif }

# Crea el archivo .env con las variables de entorno
cat > .env <<EOF
NODE_ENV=production
PORT=${app_port}
MONGODB_URI=$MONGODB_URI_SECRET
AWS_REGION=${aws_region}
EOF

# Asegura que el usuario ubuntu sea dueño de todo
chown -R ubuntu:ubuntu /home/ubuntu/app

# Clona el repositorio de GitHub
echo "Clonando repositorio desde ${github_repo_url}..."
git clone -b ${github_branch} ${github_repo_url} /home/ubuntu/app/repo

# Mueve el .env al directorio del proyecto
mv /home/ubuntu/app/.env /home/ubuntu/app/repo/.env

# Cambia al directorio del proyecto
cd /home/ubuntu/app/repo

# Construye la imagen Docker
echo "Construyendo imagen Docker..."
docker build -t ${app_name}:latest .

# Corre el contenedor con restart automático
echo "Iniciando contenedor..."
docker run -d \
  --name ${app_name} \
  --restart unless-stopped \
  -p ${app_port}:${app_port} \
  --env-file .env \
  ${app_name}:latest

# Asegura permisos correctos
chown -R ubuntu:ubuntu /home/ubuntu/app

echo "============================================"
echo "¡Aplicación desplegada exitosamente!"
echo "============================================"
echo "Docker: $(docker --version)"
echo "Contenedor: $(docker ps --filter name=${app_name} --format 'table {{.Names}}\t{{.Status}}')"
echo ""
echo "Para ver logs: docker logs -f ${app_name}"
echo "Para reiniciar: docker restart ${app_name}"
echo "============================================"
