import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jp_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // token invalid/expired — clear and let UI redirect on next render
      localStorage.removeItem("jp_token");
      localStorage.removeItem("jp_user");
    }
    return Promise.reject(err);
  }
);

export default api;
