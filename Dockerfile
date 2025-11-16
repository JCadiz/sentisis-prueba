FROM node:24-alpine

# Instalar pnpm globalmente
RUN npm install -g pnpm

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Compilar TypeScript a JavaScript
RUN pnpm run build

# Exponer puerto
EXPOSE 3000

# Ejecutar aplicación
CMD ["pnpm", "start"]
