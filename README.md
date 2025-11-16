# Sentisis Cloud Backend Challenge 🚀

API REST para gestión de tareas desarrollada con TypeScript, Express y MongoDB, aplicando Clean Architecture y desplegable automáticamente en AWS con Terraform.

[![CI/CD](https://github.com/JCadiz/sentisis-prueba/actions/workflows/ci.yml/badge.svg)](https://github.com/JCadiz/sentisis-prueba/actions)

---

## 📋 Tabla de Contenidos

- [Descripción del Challenge](#-descripción-del-challenge)
- [Características Implementadas](#-características-implementadas)
- [API Endpoints](#-api-endpoints)
- [Quick Start - Ejecución Local](#-quick-start---ejecución-local)
- [Carga Inicial de Datos](#-carga-inicial-de-datos)
- [Despliegue en AWS con Terraform](#%EF%B8%8F-despliegue-en-aws-con-terraform)
- [Arquitectura](#-arquitectura)
- [Supuestos y Decisiones de Diseño](#-supuestos-y-decisiones-de-diseño)
- [Testing y CI/CD](#-testing-y-cicd)
- [Tecnologías Utilizadas](#%EF%B8%8F-tecnologías-utilizadas)

---

## 🎯 Descripción del Challenge

Desarrollar una API REST en Node.js con TypeScript que gestione una lista de tareas, con los siguientes requisitos:

### Requisitos del Challenge:
- ✅ **API HTTP** con 3 endpoints:
  - Añadir tareas
  - Marcar tareas como realizadas
  - Comprobar estado de la lista
- ✅ **MongoDB** con Mongoose como base de datos
- ✅ **Dockerfile** funcional
- ✅ **Script init-db.ts** para carga inicial de datos
- ✅ **Terraform** para crear instancia EC2 en AWS
- ✅ **Pipeline CI/CD** con GitHub Actions
- ✅ **README** con instrucciones y razonamiento

---

## ✨ Características Implementadas

### Backend
- **TypeScript** con ES2023
- **Express.js** como framework web
- **MongoDB Atlas** con Mongoose
- **Clean Architecture** (4 capas: Domain, Application, Infrastructure, Interface)
- **Paginación** en listado de tareas
- **Validación** de datos con express-validator
- **Error Handling** centralizado
- **Logging** con Winston
- **Documentación** con Swagger/OpenAPI
- **Security** con Helmet y CORS

### DevOps
- **Docker**
- **Terraform** para infraestructura como código
- **AWS EC2** con despliegue automático
- **GitHub Actions** para CI/CD
- **Despliegue automático** - Del código al servidor en 5 minutos

---

## 📡 API Endpoints

### Documentación Interactiva
**Swagger UI:** `http://localhost:3000/api-docs`

### Endpoints Disponibles

| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| `POST` | `/api/tasks` | Crear nueva tarea | Body: `{ titulo, descripcion }` |
| `GET` | `/api/tasks` | Listar tareas (paginado) | Query: `page=1&limit=10` |
| `PATCH` | `/api/tasks/:id` | Marcar como completada/pendiente | Body: `{ estatus: true/false }` |

## 🚀 Quick Start - Ejecución Local

### Prerrequisitos
- Node.js 24+
- pnpm (o npm)
- MongoDB Atlas account (o MongoDB local)
- Docker

### 1. Clonar e Instalar

```bash
# Clonar repositorio
git clone https://github.com/JCadiz/sentisis-prueba.git
cd sentisis-prueba

# Instalar dependencias
pnpm install
```

### 2. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
# Necesitas configurar:
# - MONGODB_URI: Tu cadena de conexión a MongoDB Atlas
```

Ejemplo de `.env`:
```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/sentisis
```

NOTA: El mongo uri sera suministrado en el correo de reclutamiento.

### 3. Ejecutar en Desarrollo

```bash
pnpm run dev
```

La API estará disponible en:
- **API:** `http://localhost:3000/api/tasks`
- **Swagger UI:** `http://localhost:3000/api-docs`

### 4. Ejecutar con Docker

```bash
# Construir imagen
docker build -t sentisis-test .

# Ejecutar contenedor
docker run -p 3000:3000 \
  -e MONGODB_URI="mongodb+srv://..." \
  sentisis-test
```

---

## 📦 Carga Inicial de Datos

El proyecto incluye un script `init-db.ts` que carga datos de ejemplo en la base de datos.

### Ejecutar el Script

```bash
# Asegúrate de tener configurado MONGODB_URI en .env
pnpm run init-db
```

NOTA: Los datos ya se encuentran cargados en MongoDB Atlas pero pueden sobre escribirse con el comando anterior.

### Qué hace el script:

1. Se conecta a MongoDB
2. Limpia la colección de tareas (si existe)
3. Carga 25 tareas de ejemplo:
4. Muestra un resumen de las tareas creadas

**Ejemplo de salida:**
```
[INFO] Conectando a MongoDB...
[INFO] Conexión exitosa a la base de datos
[INFO] Limpiando colección de tareas...
[INFO] Creando tareas de ejemplo...
[INFO] ✓ 25 tareas creadas exitosamente

Resumen:
- Pendientes: x
- Completadas: x
- Total: 25

[INFO] Datos iniciales cargados correctamente
```

---

## ☁️ Despliegue en AWS con Terraform

### Despliegue Automático en 5 Minutos

Este proyecto incluye **infraestructura como código** con Terraform que despliega todo automáticamente:

✅ Servidor EC2 (Ubuntu 22.04)
✅ Docker instalado y configurado
✅ Aplicación clonada desde GitHub
✅ Imagen Docker construida
✅ Contenedor ejecutándose
✅ MongoDB URI en AWS Secrets Manager (seguro)
✅ Firewall configurado (SSH privado, API público)
✅ Llaves SSH generadas

**Un solo comando:** `terraform apply` → API funcionando en AWS

---

### Pasos para Desplegar

#### 1. Instalar Prerequisitos

- [AWS CLI](https://aws.amazon.com/cli/)
- [Terraform](https://www.terraform.io/downloads)
- Cuenta de AWS (Free Tier funciona)

#### 2. Configurar AWS CLI

```bash
aws configure
```

Ingresa:
- **Access Key ID**
- **Secret Access Key**
- **Region:** `us-east-1`
- **Output:** `json`

Verifica:
```bash
aws sts get-caller-identity
```

#### 3. Configurar Variables de Terraform

Edita `terraform/terraform.tfvars`:

```hcl
# Tu IP pública (obtén con: curl ifconfig.me)
allowed_ssh_cidr = ["TU_IP/32"]

# URL del repo (ya está configurada)
github_repo_url = "https://github.com/JCadiz/sentisis-prueba.git"

# Rama a deployar
github_branch = "master"
```

#### 4. Configurar MongoDB URI

**PowerShell (Windows):**
```powershell
$env:TF_VAR_mongodb_uri = "mongodb+srv://usuario:password@cluster.mongodb.net/sentisis"
```

**Bash/Zsh (Mac/Linux):**
```bash
export TF_VAR_mongodb_uri="mongodb+srv://usuario:password@cluster.mongodb.net/sentisis"
```

#### 5. Desplegar Infraestructura

```bash
cd terraform

# Inicializar Terraform (solo primera vez)
terraform init

# Ver qué se va a crear
terraform plan

# Crear infraestructura
terraform apply
```

Escribe `yes` cuando te lo pida.

**Espera ~5-7 minutos.** Terraform hará:
1. Crear servidor EC2
2. Instalar Docker
3. Clonar el repositorio
4. Construir imagen Docker
5. Ejecutar contenedor con la API

#### 6. Acceder a tu API

Al finalizar verás:

```bash
Outputs:

api_url = "http://98.92.156.166:3000"
instance_public_ip = "98.92.156.166"
ssh_command = "ssh -i sentisis-test-key.pem ubuntu@98.92.156.166"
```

**Probar la API:**
```bash
curl http://98.92.156.166:3000/api/tasks
```

**Swagger UI:**
```
http://98.92.156.166:3000/api-docs
```

**SSH al servidor:**
```bash
ssh -i sentisis-test-key.pem ubuntu@98.92.156.166

# Ver logs
docker logs -f sentisis-test

# Ver contenedor
docker ps
```

#### 7. Destruir Infraestructura (cuando termines)

```bash
terraform destroy
```

Esto elimina todos los recursos para evitar costos.

---

### Seguridad de Credenciales

El proyecto usa **AWS Secrets Manager** para almacenar credenciales de MongoDB de forma segura:

- ✅ MongoDB URI encriptado en AWS
- ✅ Solo la instancia EC2 puede leerlo (IAM Role)
- ✅ Credenciales nunca expuestas en logs
- ✅ Auditoría completa con CloudTrail

---

## 🏗️ Arquitectura

### Clean Architecture (4 Capas)

```
┌─────────────────────────────────────────────┐
│         INTERFACE LAYER                     │
│  HTTP Controllers, Routes, Middlewares      │
│  ▸ TaskController                           │
│  ▸ Routes (/api/tasks)                      │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│       APPLICATION LAYER                     │
│  Business Logic (Use Cases)                 │
│  ▸ CreateTaskUseCase                        │
│  ▸ GetTasksUseCase                          │
│  ▸ UpdateTaskStatusUseCase                  │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│      INFRASTRUCTURE LAYER                   │
│  DB, External Services, Configuration       │
│  ▸ MongoTaskRepository                      │
│  ▸ MongoDB Connection                       │
│  ▸ Logger, Security, Config                 │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│          DOMAIN LAYER                       │
│  Business Entities & Rules                  │
│  ▸ Task Entity                              │
│  ▸ ITaskRepository (interface)              │
└─────────────────────────────────────────────┘
```

### Estructura de Directorios

```
sintesis-prueba/
├── src/
│   ├── domain/                 # Entidades y reglas de negocio
│   │   ├── entities/          # Task.ts
│   │   └── repositories/      # ITaskRepository.ts
│   ├── application/           # Casos de uso
│   │   └── use-cases/        # CreateTask, GetTasks, UpdateTaskStatus
│   ├── infrastructure/        # Implementaciones técnicas
│   │   ├── database/         # MongoDB, Schemas, Repositories
│   │   ├── config/           # Environment, Swagger
│   │   ├── middlewares/      # Error handler, Logger
│   │   └── logger/           # Winston configuration
│   ├── interfaces/           # Capa de presentación
│   │   └── http/
│   │       ├── controllers/  # TaskController
│   │       └── routes/       # taskRoutes
│   ├── shared/              # Código compartido
│   │   └── errors/          # Custom errors
│   ├── app.ts               # Express app setup
│   └── server.ts            # Entry point
├── terraform/               # Infraestructura como código
│   ├── main.tf             # EC2, Security Groups, SSH Keys
│   ├── secrets.tf          # AWS Secrets Manager, IAM
│   ├── variables.tf        # Variables de entrada
│   ├── outputs.tf          # Outputs después del deploy
│   ├── provider.tf         # AWS, TLS, Local providers
│   ├── user-data.sh        # Bootstrap script
│   └── terraform.tfvars    # Configuración (gitignored)
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions pipeline
├── Dockerfile              # Multi-stage build
├── init-db.ts             # Script de carga inicial
└── README.md              # Este archivo
```

---

## 💡 Supuestos y Decisiones de Diseño

### ✅ Qué se Implementó

#### 1. **API REST Completa**
- 3 endpoints funcionales según especificación
- Paginación en el listado (no solicitado, pero mejora la escalabilidad)
- Validación de datos con express-validator
- Respuestas estandarizadas con formato JSON

**Razonamiento:** La paginación no estaba en los requisitos, pero es fundamental para producción cuando hay miles de tareas.

#### 2. **Clean Architecture**
- 4 capas bien definidas
- Separación de responsabilidades
- Fácil de testear y mantener

**Razonamiento:** Aunque es más código inicial, facilita enormemente el mantenimiento y la extensibilidad. Cumple con "fácilmente extensible con nuevas funcionalidades".

#### 3. **Gestión de Credenciales con AWS Secrets Manager**
- MongoDB URI encriptado
- Rol IAM con permisos mínimos
- Rotación de secretos posible

**Razonamiento:** Para cumplir con "lista para producción", las credenciales no pueden estar en variables de entorno planas. AWS Secrets Manager es el estándar de la industria.

#### 4. **Despliegue Automático**
- Terraform clona repo y ejecuta contenedor
- No requiere CI/CD para deployar
- GitHub Actions valida código

**Razonamiento:** El challenge pedía un pipeline de despliegue. Implementé dos enfoques:
- **Terraform:** Despliegue completo automático (bootstrap)
- **GitHub Actions:** Validación continua (tests, build, terraform validate)

#### 5. **Documentación con Swagger**
- API autodocumentada
- Interfaz interactiva para probar
- Schemas OpenAPI completos

**Razonamiento:** Facilita que los reclutadores prueben la API sin necesidad de leer código o escribir curl commands.

#### 6. **TypeScript Estricto**
- Tipos en todas partes
- Path aliases para imports limpios
- ES2023 features

**Razonamiento:** TypeScript ayuda a prevenir bugs en producción y mejora la mantenibilidad.

---

### ⚠️ Qué se Omitió (y por qué)

#### 1. **Autenticación y Autorización**
**Omitido:** JWT, login, roles de usuario

**Razonamiento:** No estaba en los requisitos. Agregarlo hubiera añadido complejidad innecesaria. Sin embargo, la arquitectura está preparada para agregar autenticación fácilmente:
- Ya existe middleware `validateToken.ts` (comentado)
- Ya existe middleware `validateRole.ts` (comentado)
- Solo se necesitaría crear los casos de uso de Auth

#### 2. **Actualización Completa de Tareas**
**Omitido:** Endpoint PUT para actualizar título/descripción

**Razonamiento:** El challenge solo pide "marcar como realizadas". Agregué PATCH para cambiar el estatus. Un PUT completo sería simple de agregar si se necesita.

#### 3. **Eliminación de Tareas**
**Omitido:** Endpoint DELETE

**Razonamiento:** No estaba en los requisitos. En producción real, probablemente usaría "soft delete" (marcar como eliminado) en lugar de borrar físicamente.

#### 4. **Tests Unitarios Completos**
**Implementado parcialmente:** Solo test de ejemplo

**Razonamiento:** Por tiempo, solo implementé un test de ejemplo. En producción, tendría:
- Unit tests para cada use case (>80% coverage)
- Integration tests para repositories
- E2E tests para endpoints

La arquitectura facilita el testing porque cada capa es independiente.

#### 5. **Rate Limiting**
**Omitido:** Limitación de peticiones por IP

**Razonamiento:** Para una demo es innecesario. En producción agregaría `express-rate-limit`.

#### 6. **Base de Datos Local**
**Omitido:** MongoDB local con Docker Compose

**Razonamiento:** Usé MongoDB Atlas porque:
- Más fácil para que reclutadores prueben (no necesitan instalar MongoDB)
- Es lo que se usa en producción real
- El challenge no especificaba local

#### 7. **Caché**
**Omitido:** Redis para caché

**Razonamiento:** Premature optimization. Para el volumen de una demo no es necesario. Sería el siguiente paso en producción real.

---

### 🎯 Decisiones Clave

| Decisión | Alternativa Considerada | Por qué elegí esto |
|----------|------------------------|-------------------|
| MongoDB Atlas | MongoDB local | Más fácil para reclutadores, producción real |
| Clean Architecture | MVC simple | Extensibilidad, mantenibilidad |
| Terraform bootstrap | GitHub Actions deploy | Despliegue más simple, un solo comando |
| AWS Secrets Manager | Variables de entorno | Seguridad en producción |
| pnpm | npm/yarn | Más rápido, mejor manejo de workspace |
| Swagger | Postman collection | Autodocumentado, siempre actualizado |
| Winston | console.log | Logging estructurado para producción |
| Path aliases | Imports relativos | Código más limpio |
| Docker multi-stage | Dockerfile simple | Build size más pequeño (250MB vs 800MB) |

---

## 🧪 Testing y CI/CD

### Tests

```bash
# Ejecutar tests
pnpm test
```

**Estado actual:** Test de ejemplo implementado. En producción tendría >80% coverage.

### GitHub Actions Pipeline

El proyecto tiene un pipeline CI/CD que se ejecuta en cada push:

```yaml
Jobs:
  1. Tests       → Ejecuta tests unitarios
  2. Build       → Construye imagen Docker
  3. Terraform   → Valida configuración de Terraform
```

Ver: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js 24** - Runtime
- **TypeScript** - Lenguaje con tipado estático
- **Express.js** - Framework web
- **MongoDB** + **Mongoose** - Base de datos NoSQL
- **pnpm** - Package manager

### DevOps
- **Docker** - Containerización
- **Terraform** - Infraestructura como código
- **AWS EC2** - Hosting
- **AWS Secrets Manager** - Gestión de secretos
- **GitHub Actions** - CI/CD

### Tools & Libraries
- **Swagger/OpenAPI** - Documentación de API
- **Winston** - Logging estructurado
- **Helmet** - Security headers
- **CORS** - Cross-Origin Resource Sharing
- **express-validator** - Validación de datos
- **Jest** - Testing framework

---

## 📝 Scripts Disponibles

```bash
pnpm run dev          # Desarrollo con hot-reload (tsx watch)
pnpm run build        # Compilar TypeScript a JavaScript
pnpm start            # Ejecutar en producción (desde dist/)
pnpm test             # Ejecutar tests
pnpm run init-db      # Cargar datos iniciales
pnpm run lint         # Verificar código con ESLint
```

---

## 📦 Variables de Entorno

```env
# Server
PORT=3000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sentisis

# AWS (solo para deployment)
AWS_REGION=us-east-1
```

---

## 💰 Costos Estimados (AWS)

Con el **AWS Free Tier**:
- EC2 t2.micro: **GRATIS** (primeros 12 meses, 750 horas/mes)
- AWS Secrets Manager: **~$0.40/mes**
- Data Transfer: **GRATIS** (primeros 15 GB/mes)

**Total:** ~$0.40 USD/mes (o $0 usando variables de entorno)

---

## 🔒 Seguridad Implementada

- ✅ Credenciales en AWS Secrets Manager (encriptadas)
- ✅ Variables sensibles en `.gitignore`
- ✅ Helmet para security headers
- ✅ CORS configurado
- ✅ Input validation en todos los endpoints
- ✅ Error handling que no expone detalles internos
- ✅ SSH restringido a IP específica
- ✅ IAM roles con permisos mínimos

---

## 📄 Licencia

Este proyecto fue desarrollado como solución al **Sentisis Cloud Backend Challenge**.

---

## 👤 Autor

**Jesus Cadiz**

- GitHub: [@JCadiz](https://github.com/JCadiz)
- Repositorio: [sentisis-prueba](https://github.com/JCadiz/sentisis-prueba)

---

## 🎓 Checklist del Challenge

✅ API REST funcional
✅ 3 endpoints (crear, listar, actualizar estatus)
✅ MongoDB con Mongoose
✅ Dockerfile funcional
✅ Script init-db.ts
✅ README con instrucciones completas
✅ README con supuestos y razonamiento
✅ Terraform para EC2 en AWS
✅ Pipeline de CI/CD con GitHub Actions
✅ Código listo para producción
✅ Fácilmente extensible
✅ Despliegue fácil en AWS

---

**¡Gracias por revisar mi solución!** 🚀

Si tienes preguntas sobre alguna decisión de diseño o implementación, no dudes en contactarme.
