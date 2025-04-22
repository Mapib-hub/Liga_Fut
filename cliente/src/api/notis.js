import axios from "./axios";

export const getNotisRequest = () => axios.get(`/api/notis`);

export const getNotiRequest = (id) => axios.get(`/api/notis/${id}`);

export const createNotiRequest = (task) => axios.post(`/api/notis`, task);

export const updateNotiRequest = (id, task) => 
    axios.put(`/api/notis/${id}`, task);

export const deleteNotiRequest = (id) => axios.delete(`/api/notis/${id}`);