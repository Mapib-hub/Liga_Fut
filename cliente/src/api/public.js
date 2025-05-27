// c:\Users\Acer\Desktop\proyectos\prueba_node\cliente\src\api\public.js
import axios from "axios";
// 1. Get the VITE_API_BASE_URL (e.g., http://localhost:4000/api or http://100.107.48.58:8090/api)
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 2. Derive the true backend root URL (e.g., http://localhost:4000 or http://100.107.48.58:8090)
let backendRootUrl = 'http://localhost:4000'; // Default fallback, adjust if necessary
if (VITE_API_BASE_URL) {
    if (VITE_API_BASE_URL.endsWith('/api')) {
        backendRootUrl = VITE_API_BASE_URL.substring(0, VITE_API_BASE_URL.lastIndexOf('/api'));
    } else {
        // If VITE_API_BASE_URL doesn't end with /api, assume it's already the root.
        backendRootUrl = VITE_API_BASE_URL;
    }
}
const instance = axios.create({
    //baseURL: 'http://localhost:4000/public',
    baseURL: `${backendRootUrl}/public`, // Correctly targets http://<backend_root>/public
    withCredentials: true,
});

export default instance;
