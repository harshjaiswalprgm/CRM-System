import axios from "axios";

// ✅ Create Axios instance with backend base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust this if backend runs elsewhere
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Optional: automatically attach token if stored in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
