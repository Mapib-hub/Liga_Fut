import axios from "./axios";

export const getCalendarioRequest = () => axios.get(`/api/partidos`);
////console.log(getCalendarioRequest);
export const getPartidoRequest = (id) => axios.get(`/api/partidos/${id}`);

export const createPartidoRequest = (task) => axios.post(`/api/partidos`, task);

export const deleltePartidoRequest = (id) => axios.delete(`/api/partidos/${id}`);

export const updatePartidoRequest = (id, noti) => axios.put(`/api/partidos/${id}`, noti);

export const updateGolesRequest = (id, noti) => axios.put(`/api/goles_partido/${id}`, noti);