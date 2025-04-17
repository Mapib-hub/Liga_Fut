// src/config.js

// Lee la variable de entorno definida en .env (asegúrate de que VITE_API_BASE_URL exista)
const API_URL = import.meta.env.VITE_API_BASE_URL;

// Calcula el origen (ej: http://localhost:4000)
// Si API_URL no está definida, BACKEND_ORIGIN será una cadena vacía.
// Podrías añadir un valor por defecto o un error si es crucial que siempre exista.
export const BACKEND_ORIGIN = API_URL ? new URL(API_URL).origin : '';

// Opcional: Puedes añadir una advertencia si la URL base no está configurada
if (!BACKEND_ORIGIN) {
  console.warn(
    'Advertencia: VITE_API_BASE_URL no está definida en tu archivo .env. ' +
    'Las URLs de imágenes del backend pueden no funcionar correctamente.'
  );
}

// Podrías exportar otras configuraciones globales aquí si las necesitas en el futuro
// export const DEFAULT_PAGE_SIZE = 10;
