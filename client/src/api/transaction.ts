import axios from '@/lib/axios';
import type { ApiResponse } from '@/types/response';
import type {
  CreateTransactionRequest,
  Transaction,
} from '@/types/api/transaction.types';

export const getAll = async (query: {
  limit?: number;
  accountId?: string;
  memberId?: string;
}): Promise<ApiResponse<Transaction[]>> => {
  const response = await axios.get('/transactions', { params: query });
  return response.data;
};

export const create = async (
  transaction: CreateTransactionRequest
): Promise<ApiResponse<Transaction>> => {
  const response = await axios.post('/transactions', transaction);
  return response.data;
};

export const getTransactionById = async (
  id: string
): Promise<ApiResponse<Transaction>> => {
  const response = await axios.get(`/transactions/${id}`);
  return response.data;
};

export const deleteTransaction = async (id: string) => {
  const response = await axios.delete(`/transactions/${id}`);
  return response.data;
};

export const updateTransaction = async (
  id: string,
  transaction: CreateTransactionRequest
): Promise<ApiResponse<Transaction>> => {
  const response = await axios.post(`/transactions/${id}`, transaction);
  return response.data;
};
