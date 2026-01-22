import axios from 'axios';

const PROD_API = 'https://motorshop-api.desarrollo-software.xyz';
const LOCAL_API = 'http://localhost:3000';

// Logic: Check if we are running on localhost frontend. 
// If specific ENV var is set, use it. 
// Otherwise, if frontend is localhost, default to local backend but allow fallback.
// If frontend is production domain, force production backend.

const getBaseUrl = () => {
    // 1. If explicit env var is set (e.g. from .env.production), use it
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

    // 2. If running on localhost (dev mode), try localhost first
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return LOCAL_API;
    }

    // 3. Otherwise (deployed frontend), use production backend
    return PROD_API;
};

export const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
