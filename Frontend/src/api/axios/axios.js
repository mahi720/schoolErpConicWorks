import axios from "axios";
import { useAuthStore } from "../../store/auth/authStore";
// import { refreshApi } from "../auth/authApi";


const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

const REFRESH_API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

API.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/login") &&
            !originalRequest.url.includes("/auth/refresh") &&
            !originalRequest.url.includes("/auth/me")
        ) {
            originalRequest._retry = true;

            try {
                const res = await REFRESH_API.post("/auth/refresh");

                useAuthStore.getState().setAuth({
                    user: res.data.data.user,
                    accessToken: res.data.data.accessToken,
                });

                originalRequest.headers.Authorization = `Bearer ${res.data.data.accessToken}`;

                return API(originalRequest);
            } catch {
                useAuthStore.getState().clearAuth();
                window.location.replace("/login");
            }
        }

        return Promise.reject(error);
    }
);

export default API;