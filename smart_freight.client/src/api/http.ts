import axios from 'axios';
import { clearAuthStorage, getAuthStorage } from '../context/authStorage';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

export const httpClient = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

httpClient.interceptors.request.use((config) => {
    const auth = getAuthStorage();
    if (auth?.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
});

httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            clearAuthStorage();
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        if (error?.response?.status === 403) {
            if (window.location.pathname !== '/not-authorized') {
                window.location.href = '/not-authorized';
            }
        }
        return Promise.reject(error);
    }
);
