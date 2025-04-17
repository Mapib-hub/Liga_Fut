# Usa una imagen base de Node.js (elige una versión LTS estable, Alpine es más ligera)
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia package.json y package-lock.json (o yarn.lock)
# Copiar estos primero aprovecha el caché de capas de Docker si no cambian
COPY package*.json ./

# Instala las dependencias de producción
RUN npm install --omit=dev

# Copia el resto del código fuente de la aplicación
COPY . .

# Expón el puerto en el que corre la aplicación
EXPOSE 4000

# Comando para ejecutar la aplicación cuando el contenedor inicie
CMD [ "node", "src/index.js" ]
