// src/config.js

// Lee la variable específica para el origen de las imágenes del backend
const backendOriginUrl = import.meta.env.VITE_BACKEND_IMAGE_ORIGIN;

// Exporta directamente la URL leída del .env
export const BACKEND_ORIGIN = backendOriginUrl || ''; // Usa un string vacío como fallback

// Opcional: Puedes añadir una advertencia si la URL no está configurada
if (!BACKEND_ORIGIN) {
  console.warn(
    'Advertencia: VITE_BACKEND_IMAGE_ORIGIN no está definida en tu archivo .env. ' +
    'Las URLs de imágenes del backend pueden no funcionar correctamente.'
  );
}

// Ya no necesitamos leer VITE_API_BASE_URL aquí

// Podrías exportar otras configuraciones globales aquí si las necesitas en el futuro
// export const DEFAULT_PAGE_SIZE = 10;
