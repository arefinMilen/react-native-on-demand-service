import axios from 'axios';

export const ADMIN_API_BASE_URL = 'http://localhost:5000/api/v1';

export const adminApi = axios.create({
  baseURL: ADMIN_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAdminToken = (token: string) => {
  adminApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};
