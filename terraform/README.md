# Despliegue Automático en AWS con Terraform

Esta guía te permite desplegar la API completa en AWS EC2 de forma **100% automática** usando Terraform.

## ¿Qué hace este Terraform?

Cuando ejecutes `terraform apply`, se creará automáticamente:

- ✅ Servidor EC2 (Ubuntu 22.04)
- ✅ Docker instalado y configurado
- ✅ Tu aplicación clonada desde GitHub
- ✅ Imagen Docker construida
- ✅ Contenedor corriendo en el puerto 3000
- ✅ Credenciales de MongoDB guardadas de forma segura en AWS Secrets Manager
- ✅ Firewall configurado (SSH solo desde tu IP, API pública)
- ✅ Llaves SSH generadas automáticamente

**Todo listo en ~5-7 minutos.**

---

## Prerrequisitos

1. **Cuenta de AWS** (puedes usar el free tier)
2. **AWS CLI instalado** ([Descargar](https://aws.amazon.com/cli/))
3. **Terraform instalado** ([Descargar](https://www.terraform.io/downloads))
4. **MongoDB Atlas** con una base de datos creada
5. **Este repositorio debe estar en GitHub** (público o privado)

---

## Paso 1: Configura AWS CLI

Configura tus credenciales de AWS:

```bash
aws configure
```

Te pedirá:
- **Access Key ID**: Tu clave de AWS
- **Secret Access Key**: Tu clave secreta
- **Region**: `us-east-1` (recomendado)
- **Output format**: `json`

Verifica que funcione:
```bash
aws sts get-caller-identity
```

---

## Paso 2: Clona este repositorio

```bash
git clone https://github.com/TU_USUARIO/sintesis-test.git
cd sintesis-test/terraform
```

---

## Paso 3: Configura las variables

Edita el archivo `terraform.tfvars`:

### 1. URL de tu repositorio de GitHub:
```hcl
github_repo_url = "https://github.com/TU_USUARIO/sintesis-test.git"
```

### 2. Tu IP pública (para SSH):
Obtén tu IP:
```bash
curl ifconfig.me
```

Luego actualiza en `terraform.tfvars`:
```hcl
allowed_ssh_cidr = ["TU_IP/32"]  # Ejemplo: ["203.0.113.0/32"]
```

### 3. URI de MongoDB (variable de entorno):

**PowerShell (Windows):**
```powershell
$env:TF_VAR_mongodb_uri = "mongodb+srv://usuario:password@cluster.mongodb.net/database"
```

**Bash/Zsh (Mac/Linux):**
```bash
export TF_VAR_mongodb_uri="mongodb+srv://usuario:password@cluster.mongodb.net/database"
```

---

## Paso 4: Despliega la infraestructura

### 1. Inicializa Terraform (solo primera vez):
```bash
terraform init
```

### 2. Revisa qué se va a crear:
```bash
terraform plan
```

Deberías ver que se van a crear ~11 recursos.

### 3. Crea la infraestructura:
```bash
terraform apply
```

Escribe `yes` cuando te lo pida.

**Espera ~5-7 minutos.** Terraform hará todo automáticamente:
1. Crea el servidor EC2
2. Instala Docker
3. Clona tu repositorio
4. Construye la imagen Docker
5. Corre el contenedor con tu API

---

## Paso 5: Accede a tu API

Al finalizar, Terraform te mostrará:

```bash
Apply complete! Resources: 11 added, 0 changed, 0 destroyed.

Outputs:

api_url = "http://54.123.45.67:3000"
instance_public_ip = "54.123.45.67"
ssh_command = "ssh -i sentisis-test-key.pem ubuntu@54.123.45.67"
```

### Prueba tu API:
```bash
curl http://54.123.45.67:3000/api/tasks
```

### Accede a Swagger UI:
Abre en tu navegador:
```
http://54.123.45.67:3000/api-docs
```

### Conectarte por SSH:
```bash
ssh -i sentisis-test-key.pem ubuntu@54.123.45.67
```

Una vez dentro, puedes:
```bash
# Ver logs del contenedor
docker logs -f sentisis-test

# Ver contenedores corriendo
docker ps

# Reiniciar la aplicación
docker restart sentisis-test

# Ver el código
cd /home/ubuntu/app/repo
```

---

## Actualizar el código

Si haces cambios en tu repositorio:

### Opción A - Redeploy completo:
```bash
terraform destroy
terraform apply
```

### Opción B - Actualización manual (más rápido):
```bash
# Conéctate por SSH
ssh -i sentisis-test-key.pem ubuntu@<IP>

# Actualiza el código
cd /home/ubuntu/app/repo
git pull

# Reconstruye y reinicia
docker build -t sentisis-test:latest .
docker stop sentisis-test
docker rm sentisis-test
docker run -d \
  --name sentisis-test \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  sentisis-test:latest
```

---

## Destruir todo

Cuando termines de probar (para no generar costos):

```bash
terraform destroy
```

Esto eliminará **todos** los recursos de AWS.

---

## Costos estimados

Con el **AWS Free Tier**:
- EC2 t2.micro: **GRATIS** (primeros 12 meses)
- AWS Secrets Manager: **~$0.40/mes**
- Tráfico de red: **GRATIS** (primeros 15 GB/mes)

**Costo total mensual:** ~$0.40 USD

---

## Troubleshooting

### La API no responde

1. Verifica que el contenedor esté corriendo:
   ```bash
   ssh -i sentisis-test-key.pem ubuntu@<IP>
   docker ps
   ```

2. Revisa los logs de la aplicación:
   ```bash
   docker logs sentisis-test
   ```

3. Revisa el log de instalación:
   ```bash
   sudo tail -f /var/log/user-data.log
   ```

### Error al hacer SSH

- En Windows, usa Git Bash o WSL
- Verifica permisos: `chmod 600 sentisis-test-key.pem` (Mac/Linux)
- Asegúrate que tu IP esté en `allowed_ssh_cidr`
- Espera 2-3 minutos después de `terraform apply`

### Error de MongoDB

- Verifica que la URI sea correcta
- En MongoDB Atlas → Network Access → Add IP Address
- Agrega la IP del servidor (la que muestra `instance_public_ip`)
- O permite todas las IPs: `0.0.0.0/0` (solo para pruebas)

---

## Variables configurables

En `terraform.tfvars`:

| Variable | Descripción | Default |
|----------|-------------|---------|
| `github_repo_url` | URL del repo de GitHub | **Requerido** |
| `github_branch` | Rama a deployar | `master` |
| `aws_region` | Región de AWS | `us-east-1` |
| `environment` | Ambiente (dev/prod) | `dev` |
| `instance_type` | Tipo de instancia EC2 | `t2.micro` |
| `app_port` | Puerto de la API | `3000` |
| `allowed_ssh_cidr` | IPs permitidas para SSH | Tu IP |
| `allowed_api_cidr` | IPs permitidas para API | `0.0.0.0/0` |

---

## Seguridad

✅ **Implementado:**
- Credenciales en AWS Secrets Manager (encriptadas)
- SSH solo desde IPs específicas
- Rol IAM con permisos mínimos
- Variables sensibles marcadas como `sensitive`
- Contenedor con restart automático

⚠️ **Recomendaciones:**
- Usa un repositorio privado de GitHub
- No subas `terraform.tfvars` a git (ya está en `.gitignore`)
- Rota las credenciales de MongoDB regularmente
- Para producción, considera agregar HTTPS/SSL

---

## Arquitectura

```
┌─────────────────────────────────────────────┐
│           AWS Cloud (us-east-1)             │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │         EC2 Instance (Ubuntu)         │ │
│  │                                       │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │   Docker Container              │ │ │
│  │  │   Node.js API (Port 3000)      │ │ │
│  │  │   - Express + TypeScript       │ │ │
│  │  │   - MongoDB Driver             │ │ │
│  │  │   - Swagger UI                 │ │ │
│  │  └─────────────────────────────────┘ │ │
│  │                                       │ │
│  │  .env (Variables desde Secrets)      │ │
│  └───────────────────────────────────────┘ │
│           ↓                  ↑              │
│  ┌─────────────────┐  ┌──────────────┐     │
│  │ Secrets Manager │  │Security Group│     │
│  │  (MongoDB URI)  │  │ SSH: Tu IP   │     │
│  └─────────────────┘  │ API: Público │     │
│                       └──────────────┘     │
└─────────────────────────────────────────────┘
                  ↓
        ┌───────────────────┐
        │  MongoDB Atlas    │
        └───────────────────┘
```

---

## Archivos del proyecto

- `main.tf` - Recursos principales (EC2, Security Group, SSH Keys)
- `secrets.tf` - Configuración de AWS Secrets Manager e IAM
- `variables.tf` - Definición de variables
- `outputs.tf` - Valores de salida después del deploy
- `provider.tf` - Configuración de proveedores (AWS, TLS, Local)
- `user-data.sh` - Script que se ejecuta al crear la instancia
- `terraform.tfvars` - **TUS valores** (no subir a git)
- `README-SECRETS.md` - Guía sobre seguridad de credenciales

---

## Comandos útiles

```bash
# Ver outputs después del apply
terraform output

# Ver solo la URL de la API
terraform output -raw api_url

# Ver el comando SSH
terraform output -raw ssh_command

# Ver el estado actual
terraform show

# Forzar recreación de la instancia
terraform taint aws_instance.app_server
terraform apply
```

---

**¡Listo!** Ahora tienes tu API desplegada en AWS. 🚀

Para más información sobre seguridad de credenciales, revisa `README-SECRETS.md`.
