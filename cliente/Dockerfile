# --- Etapa 1: Construcción (Build Stage) ---
    FROM node:18-alpine as builder

    # Establece el directorio de trabajo
    WORKDIR /app
     
    # Copia package.json y package-lock.json (o yarn.lock)
    COPY package*.json ./
    
    # Instala todas las dependencias (incluyendo devDependencies para construir)
    RUN npm install
    #COPY .env ./
    # Copia el resto del código fuente del cliente
    COPY . .
      
    # Construye la aplicación para producción
    # Si usas variables de entorno VITE_, puedes pasarlas aquí con ARG y --build-arg
   # ... antes de RUN npm run build
    ARG VITE_API_BASE_URL_ARG
    ENV VITE_API_BASE_URL=$VITE_API_BASE_URL_ARG
    ARG VITE_BACKEND_IMAGE_ORIGIN_ARG 
    ENV VITE_BACKEND_IMAGE_ORIGIN=$VITE_BACKEND_IMAGE_ORIGIN_ARG 
    RUN npm run build

    
    # --- Etapa 2: Producción (Production Stage) ---
    # Usa una imagen ligera de Nginx
    FROM nginx:stable-alpine
    
    # Copia la configuración personalizada de Nginx (la crearemos a continuación)
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Copia los archivos estáticos construidos desde la etapa 'builder' al directorio web de Nginx
    COPY --from=builder /app/dist /usr/share/nginx/html
    
    # Expón el puerto 80 (puerto por defecto de Nginx)
    EXPOSE 80
    
    # Comando para iniciar Nginx en primer plano
    CMD ["nginx", "-g", "daemon off;"]
    