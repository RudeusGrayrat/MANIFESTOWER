import axios from "axios";
const urlServer = import.meta.env.VITE_SERVER_URL
const instance = axios.create({
  baseURL: urlServer,
  withCredentials: true,
});

export default instance;
