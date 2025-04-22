import axios from "./axios";

export const getJugadoresRequest = () => axios.get(`/api/players`); 

export const getJugadorRequest = (id) => axios.get(`/api/players/${id}`);

export const createJugadorRequest = (data) => axios.post(`/api/players`, data);

export const delelteJugadorRequest = (id) => axios.delete(`/api/players/${id}`);

export const updateJugadorRequest = (id, data) => axios.put(`/api/players/${id}`, data);

export const updateGolesRequest = (id, data) => axios.put(`/api/goles/${id}`, data);