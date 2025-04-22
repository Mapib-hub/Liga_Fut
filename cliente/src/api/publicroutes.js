import axios from "./public";

export const getNoticiasPublic = () => axios.get(`/noticias/`);

export const getNoticiaPublic = (id) => axios.get(`/noticias/${id}`);

export const getCarruselPublic = () => axios.get(`/carrusel/`);

export const getNoticiasPublic_3 = () => axios.get(`/notis_3/`);

export const getJugadoresRequest = () => axios.get(`/jugadores`); 

export const getJugadorRequest = (id) => axios.get(`/jugadores/${id}`);

export const getEquiposRequest = () => axios.get(`/equipos`);

export const getEquipoRequest = (id) => axios.get(`/equipos/${id}`);

export const getFechasRequest = () => axios.get(`/fechas`);

export const getFechaRequest = (id) => axios.get(`/fechas/${id}`);

export const getCalendarioRequest = () => axios.get(`/partidos`);

export const getPartidoRequest = (id) => axios.get(`/partidos/${id}`);




