import axios from "axios";
const urlServer = import.meta.env.VITE_SERVER_URL
const instance = axios.create({
  baseURL: urlServer,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
