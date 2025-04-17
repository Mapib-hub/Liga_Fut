// src/api/equipos.js
import axios from "./axios"; // Importa tu instancia configurada de axios

export const getEquiposRequest = () => axios.get(`/equipos`);

export const getEquipoRequest = (id) => axios.get(`/equipos/${id}`);

export const createEquipoRequest = (equipo) => axios.post(`/equipos`, equipo);

export const updateEquipoRequest = (id, equipo) => axios.put(`/equipos/${id}`, equipo);

export const deleteEquipoRequest = (id) => axios.delete(`/equipos/${id}`);
