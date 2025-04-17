// 1. Lee la variable de entorno 'TOKEN_SECRET'.
// 2. Si no existe, usa un valor por defecto *solo para desarrollo*.
//    ¡Asegúrate de que el valor en producción sea diferente y seguro!
export const TOKEN_SECRET = process.env.TOKEN_SECRET || 'clave_secreta_solo_para_desarrollo_local';
