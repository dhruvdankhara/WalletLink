import axios from '@/lib/axios';
import type { ApiResponse } from '../types/response';
import type { User } from '@/types/api/auth.types';

export const getAll = async (): Promise<ApiResponse<User[]>> => {
  const response = await axios.get('/members');
  return response.data;
};

export const create = async (email: string): Promise<ApiResponse<null>> => {
  const response = await axios.post('/members', { email });
  return response.data;
};

export const acceptInvite = async (
  token: string,
  data: {
    firstname: string;
    lastname: string;
    password: string;
  }
) => {
  const response = await axios.post(`/members/invite?token=${token}`, data);
  return response.data;
};

export const deleteMember = async (
  memberId: string
): Promise<ApiResponse<null>> => {
  const response = await axios.delete(`/members/${memberId}`);
  return response.data;
};

export const getMemberById = async (
  memberId: string
): Promise<ApiResponse<User>> => {
  const response = await axios.get(`/members/${memberId}`);
  return response.data;
};

export const updateMember = async (
  memberId: string,
  data: {
    firstname?: string;
    lastname?: string;
    email?: string;
    role?: string;
  }
): Promise<ApiResponse<User>> => {
  const response = await axios.post(`/members/${memberId}`, data);
  return response.data;
};
