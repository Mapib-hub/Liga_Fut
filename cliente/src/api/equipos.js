// src/api/equipos.js
import axios from "./axios"; // Importa tu instancia configurada de axios

export const getEquiposRequest = () => axios.get(`/api/equipos`);

export const getEquipoRequest = (id) => axios.get(`/api/equipos/${id}`);

export const createEquipoRequest = (equipoData) => axios.post(`/api/equipos/`, equipoData);

export const updateEquipoRequest = (id, equipoData) => 
    axios.put(`/api/equipos/${id}`, equipoData);

/*export const createEquipoRequest = (equipoData) => {
    // equipoData DEBE ser un objeto FormData
   // console.log("Llamando a createEquipoRequest con ruta /equipos"); // Log
    return axios.post(`/api/equipos`, equipoData, {
      headers: {
        'Content-Type': 'multipart/form-data' // <-- AÑADE ESTO
      }
    });
  };
  // --- FIN DE LA MODIFICACIÓN ---
  
  // --- MODIFICA updateEquipoRequest (si también sube archivos) ---
  export const updateEquipoRequest = (id, equipoData) => {
    // equipoData DEBE ser un objeto FormData si actualizas imagen
   // console.log(`Llamando a updateEquipoRequest con ruta /equipos/${id}`); // Log
    return axios.put(`/api/equipos/${id}`, equipoData, {
      headers: {
        'Content-Type': 'multipart/form-data' // <-- AÑADE ESTO
      }
    });
  };*/

export const deleteEquipoRequest = (id) => axios.delete(`/api/equipos/${id}`);
 