import axios from 'axios';

// URL base del backend
// const API_URL = 'http://localhost:3001/api';
const API_URL = import.meta.env.VITE_API_URL;

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(config);
      
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;