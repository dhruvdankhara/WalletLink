import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../types/response.ts';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ApiErrorResponse>) => {
    const errorMsg = err.response?.data?.message || err.message;
    return Promise.reject(new Error(errorMsg));
  }
);

export default axiosInstance;
