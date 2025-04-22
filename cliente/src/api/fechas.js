// src/api/Fechas.js
import axios from "./axios"; // Importa tu instancia configurada de axios

export const getFechasRequest = () => axios.get(`/api/fechas`);

export const getFechaRequest = (id) => axios.get(`/api/fechas/${id}`);

export const createFechaRequest = (FechaData) => axios.post(`/api/fechas/`, FechaData);

export const updateFechaRequest = (id, FechaData) => 
    axios.put(`/api/fechas/${id}`, FechaData);

export const deleteFechaRequest = (id) => axios.delete(`/api/fechas/${id}`);
 