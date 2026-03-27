import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "";
const MODE = import.meta.env.MODE || "production";
if (!BASE_URL && MODE === "development") {
    console.warn("API URL is not set. Please set VITE_API_URL in your environment variables.");
}
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default apiClient;
