import axios from "./axios";

export const getNotisRequest = () => axios.get(`/notis`);

export const getNotiRequest = (id) => axios.get(`/notis/${id}`);

export const createNotiRequest = (task) => axios.post(`/notis`, task);

export const updateNotiRequest = (id, task) => 
    axios.put(`/tasks/${id}`, task);

export const deleteNotiRequest = (id) => axios.delete(`/notis/${id}`);