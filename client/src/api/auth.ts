import axios from '@/lib/axios';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from '@/types/api/auth.types';
import type { ApiResponse } from '@/types/response';

export const register = async (
  data: RegisterRequest
): Promise<ApiResponse<LoginResponse>> => {
  const response = await axios.post('/users/register', data);
  return response.data;
};

export const login = async (
  data: LoginRequest
): Promise<ApiResponse<LoginResponse>> => {
  const response = await axios.post('/users/login', data);
  return response.data;
};

export const me = async (): Promise<ApiResponse<User>> => {
  const response = await axios.get('/users/me');
  return response.data;
};

export const logout = async (): Promise<ApiResponse<null>> => {
  const response = await axios.post('/users/logout');
  return response.data;
};
