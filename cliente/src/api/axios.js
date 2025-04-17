// En algún archivo como cliente/src/api/axios.js o similar
import axios from 'axios';

// 1. Lee la variable de entorno inyectada por Vite.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const instance = axios.create({
    baseURL: API_BASE_URL, // 2. Usa la variable como URL base
    withCredentials: true // Mantén esto si usas cookies para autenticación
});

export default instance;

// Luego, en tus componentes, importas esta instancia y haces llamadas relativas:
// import apiClient from './api/axios';
// apiClient.get('/tasks'); // Esto llamará a http://localhost:4000/api/tasks
// apiClient.post('/login', data); // Esto llamará a http://localhost:4000/api/login
