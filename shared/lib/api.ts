import axios from "axios";
import Cookies from "js-cookie"; // Asegúrate de tener instalado js-cookie

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api",
});

// Este interceptor es el que "cura" los errores 401 de la consola
api.interceptors.request.use((config) => {
  // Leemos la cookie 'token' que tu useAuthStore ya está guardando
  const token = Cookies.get("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
