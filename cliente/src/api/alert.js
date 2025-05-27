import axiosApiInstance from './axios'; // Instancia para rutas /api (protegidas), baseURL es VITE_API_BASE_URL (ej: http://.../api)
import publicAxiosInstance from './public'; // Instancia para rutas /public, baseURL es backendRootUrl/public (ej: http://.../public)

/**
 * Obtiene el estado actual de la alerta desde el backend.
 * (Para el panel de admin - podría llamar al endpoint público o a uno específico de admin)
 */
export const getAlertRequest = () => publicAxiosInstance.get('/alert');

// NOTA: Por ahora, llamamos al mismo endpoint público. Si necesitas datos
// diferentes para el admin, puedes cambiar esto a un endpoint como '/admin/alert/status'.

/**
 * Envía los datos actualizados de la alerta al backend para guardarlos.
 * (Para el panel de admin - DEBE llamar a un endpoint protegido)
 * @param {object} alertData - Objeto con { isActive, message, type }
 */
export const updateAlertRequest = (alertData) => axiosApiInstance.put('/alert', alertData);
// NOTA: Usamos PUT y una ruta '/admin/alert'. Necesitarás crear esta
// ruta protegida en tu backend para manejar la actualización.
