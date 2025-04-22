import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:4000/public'
    ///withCredentials: true,
});

export default instance;