# ./servidor/Dockerfile

# 1. Etapa Base: Usar una imagen oficial de Node.js (elige una versión LTS)
FROM node:18-alpine AS base

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app
 
# Copiar solo los archivos de manifiesto primero para aprovechar el caché de Docker
COPY package.json package-lock.json* ./

# 2. Etapa de Dependencias: Instalar solo dependencias de producción
FROM base AS dependencies
# Instalar dependencias de producción de forma limpia
RUN npm ci --only=production

# 3. Etapa de Ejecución: Copiar código y dependencias instaladas
FROM base AS runner
WORKDIR /app

# Copiar las dependencias instaladas en la etapa anterior
COPY --from=dependencies /app/node_modules ./node_modules

# Copiar el resto del código de la aplicación
COPY . .

# --- ¡NUEVAS LÍNEAS AQUÍ! ---
# Copia el script de espera al directorio bin de la imagen
COPY wait-for-mongo.sh /usr/local/bin/wait-for-mongo.sh

# Instala netcat (nc) y da permisos de ejecución al script
# 'apk add --no-cache' es para Alpine Linux
RUN apk add --no-cache netcat-openbsd && chmod +x /usr/local/bin/wait-for-mongo.sh
# --- FIN DE NUEVAS LÍNEAS ---

# Exponer el puerto en el que corre tu aplicación backend
EXPOSE 4000

# --- ¡CMD MODIFICADO! ---
# Comando para iniciar la aplicación: ejecuta el script de espera,
# pasándole el comando original ("node src/index.js") como argumentos.
# --- ¡CMD MODIFICADO! ---
# Comando para iniciar la aplicación: ejecuta el script de espera,
# pasándole el comando original ("node src/index.js") como argumentos.
CMD wait-for-mongo.sh node src/index.js


