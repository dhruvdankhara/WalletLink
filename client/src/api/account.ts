import axios from '@/lib/axios';
import type {
  AccountWithTransactions,
  CreateAccountRequest,
  UpdateAccountRequest,
} from '@/types/api/account.types';
import type { ApiResponse } from '@/types/response';

export const create = async (
  data: CreateAccountRequest
): Promise<ApiResponse<AccountWithTransactions>> => {
  const response = await axios.post('/accounts', data);
  return response.data;
};

export const getAll = async (
  memberId?: string
): Promise<ApiResponse<AccountWithTransactions[]>> => {
  const response = await axios.get('/accounts', {
    params: {
      memberId,
    },
  });
  return response.data;
};

export const updateAccount = async (
  id: string,
  data: UpdateAccountRequest
): Promise<ApiResponse<AccountWithTransactions>> => {
  const response = await axios.post(`/accounts/${id}`, data);
  return response.data;
};

export const deleteAccount = async (id: string): Promise<ApiResponse<null>> => {
  const response = await axios.delete(`/accounts/${id}`);
  return response.data;
};

export const getAccountById = async (
  id: string
): Promise<ApiResponse<AccountWithTransactions>> => {
  const response = await axios.get(`/accounts/${id}`);
  return response.data;
};
