# Arquitectura del Proyecto

## Clean Architecture - TypeScript

Este proyecto implementa Clean Architecture con 4 capas bien definidas, basado en el proyecto Wallet-Backoffice pero adaptado para TypeScript.

## Capas de la Arquitectura

### 1. Domain (Dominio)
**Ubicación:** `src/domain/`

Contiene la lógica de negocio pura:
- `entities/` - Entidades de negocio
- `repositories/` - Interfaces de repositorios (Ports/Contracts)
- `value-objects/` - Objetos de valor con validaciones

**Reglas:**
- No depende de ninguna otra capa
- No tiene dependencias externas
- Lógica de negocio pura

### 2. Application (Aplicación)
**Ubicación:** `src/application/`

Orquesta la lógica de negocio:
- `use-cases/` - Casos de uso (interactors)
- `dtos/` - Data Transfer Objects
- `interfaces/` - Contratos de servicios

**Reglas:**
- Solo depende de Domain
- Contiene la lógica de la aplicación
- Define los puertos (interfaces)

### 3. Infrastructure (Infraestructura)
**Ubicación:** `src/infrastructure/`

Implementaciones concretas:
- `database/` - Conexiones y repositorios concretos
- `middlewares/` - Middlewares globales
- `logger/` - Sistema de logging
- `config/` - Configuración de entorno
- `security/` - JWT, bcrypt, etc.

**Reglas:**
- Implementa los puertos definidos en Application
- Puede depender de Domain y Application
- Contiene detalles de implementación

### 4. Interfaces (Presentación)
**Ubicación:** `src/interfaces/`

Adaptadores de entrada/salida:
- `http/controllers/` - Controladores HTTP
- `http/routes/` - Definición de rutas
- `http/middlewares/` - Middlewares específicos

**Reglas:**
- Adapta las peticiones externas a los use cases
- Depende de Application
- No contiene lógica de negocio

### Shared
**Ubicación:** `src/shared/`

Código compartido entre capas:
- `errors/` - Errores personalizados
- `utils/` - Utilidades comunes

## Archivos Implementados

### Configuración
- ✅ `tsconfig.json` - TypeScript ES2023 con path aliases
- ✅ `package.json` - Scripts y dependencias
- ✅ `.env.example` - Variables de entorno
- ✅ `.gitignore` - Archivos ignorados

### Core
- ✅ `src/app.ts` - Aplicación principal
- ✅ `src/server.ts` - Punto de entrada

### Infrastructure
- ✅ `infrastructure/database/mongodb.ts` - Conexión Mongoose (Singleton)
- ✅ `infrastructure/config/env.ts` - Configuración centralizada
- ✅ `infrastructure/logger/logger.ts` - Winston logger

### Middlewares
- ✅ `infrastructure/middlewares/errorHandler.ts` - Manejo global de errores
- ✅ `infrastructure/middlewares/requestLogger.ts` - Log de peticiones HTTP
- ✅ `infrastructure/middlewares/validateToken.ts` - Autenticación JWT
- ✅ `infrastructure/middlewares/validateRole.ts` - Autorización RBAC

### Errors
- ✅ `shared/errors/AppError.ts` - Error base
- ✅ `shared/errors/NotFoundError.ts` - 404
- ✅ `shared/errors/UnauthorizedError.ts` - 401
- ✅ `shared/errors/ForbiddenError.ts` - 403
- ✅ `shared/errors/BadRequestError.ts` - 400

### Routes
- ✅ `interfaces/http/routes/index.ts` - Router principal con health check

## Path Aliases Configurados

```typescript
@domain/*          → src/domain/*
@application/*     → src/application/*
@infrastructure/*  → src/infrastructure/*
@interfaces/*      → src/interfaces/*
@config/*          → src/config/*
@shared/*          → src/shared/*
```

## Flujo de una Petición

```
1. Cliente → HTTP Request
   ↓
2. Express App (app.ts)
   ↓
3. Middlewares Globales:
   - Helmet (seguridad)
   - CORS
   - Body Parser
   - Request Logger
   ↓
4. validateToken (autenticación)
   - Verifica JWT
   - Adjunta user a req
   ↓
5. Routes (/api/*)
   ↓
6. validateRole (autorización)
   - Verifica permisos
   ↓
7. Controller (interfaces/http/controllers)
   - Extrae datos del request
   - Llama al Use Case
   ↓
8. Use Case (application/use-cases)
   - Ejecuta lógica de negocio
   - Usa Repository Interface
   ↓
9. Repository Implementation (infrastructure)
   - Accede a la base de datos
   ↓
10. Database (MongoDB)
   ↓
11. Respuesta ← Controller
   ↓
12. Cliente ← HTTP Response
```

## Patrón Repository

### Interface (Port) - Domain
```typescript
// src/domain/repositories/IUserRepository.ts
export interface IUserRepository {
    findById(id: string): Promise<User | null>;
    save(user: User): Promise<void>;
}
```

### Implementación (Adapter) - Infrastructure
```typescript
// src/infrastructure/persistence/MongoUserRepository.ts
export class MongoUserRepository implements IUserRepository {
    async findById(id: string): Promise<User | null> {
        // Implementación con Mongoose
    }
}
```

## Patrón Use Case

```typescript
// src/application/use-cases/GetUserById.ts
export class GetUserById {
    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(userId: string): Promise<User> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return user;
    }
}
```

## Dependency Injection

Se usará un sistema simple de factories:

```typescript
// src/config/dependencies.ts
export class DependencyContainer {
    static createGetUserById(): GetUserById {
        const userRepository = new MongoUserRepository();
        return new GetUserById(userRepository);
    }
}
```

## Comparación con Wallet-Backoffice

| Aspecto | Wallet-Backoffice (JS) | Sintesis-Test (TS) |
|---------|------------------------|---------------------|
| Lenguaje | JavaScript | TypeScript ES2023 |
| DB Driver | MongoDB native | Mongoose |
| Arquitectura | Clean + Hexagonal | Clean Architecture |
| DI | Module.exports factory | Class-based factories |
| Errors | throw new Error() | Custom Error classes |
| Logging | Winston | Winston + tipos |
| Middlewares | Function exports | Typed functions |
| Path Aliases | No | Sí (@domain, etc.) |

## Próximos Pasos

### Implementar módulos de negocio:
1. Auth (login, register, logout)
2. Users (CRUD)
3. Transactions (según requerimientos)

### Agregar validaciones:
- Joi o Zod para validación de schemas
- DTOs para cada use case

### Testing:
- Jest para unit tests
- Supertest para integration tests
- Coverage > 80%

### DevOps:
- Docker y docker-compose
- CI/CD con GitHub Actions
- Deploy en Render/Railway/Heroku

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Compilar
npm run build

# Ver archivos compilados
ls -la dist/

# Ejecutar producción
npm start

# Linter
npm run lint:fix

# Format
npm run format
```

## Beneficios de Clean Architecture

1. **Testeable** - Fácil hacer unit tests
2. **Mantenible** - Cambios aislados por capa
3. **Escalable** - Agregar features sin romper código existente
4. **Independiente de frameworks** - Fácil migrar a otro framework
5. **Independiente de UI** - Misma lógica para REST, GraphQL, CLI
6. **Independiente de DB** - Cambiar MongoDB por PostgreSQL sin tocar use cases
