import axios from '@/lib/axios';
import type { ApiResponse } from '@/types/response';
import type { Account } from '@/types/api/account.types';
import type {
  CategoryBreakdown,
  DashboardMembers,
  monthlyIncomeExpense,
} from '@/types/api/dashboard.types';
import type { Transaction } from '@/types/api/transaction.types';

export const getAllAccounts = async (): Promise<ApiResponse<Account[]>> => {
  const response = await axios.get('/dashboard/account');
  return response.data;
};

export const getAllMembers = async ({
  from,
  to,
}: {
  from: Date;
  to: Date;
}): Promise<ApiResponse<DashboardMembers[]>> => {
  const response = await axios.get('/dashboard/members', {
    params: { from, to },
  });
  return response.data;
};

export const getMonthlyIncomeExpense = async (): Promise<
  ApiResponse<monthlyIncomeExpense[]>
> => {
  const response = await axios.get('/dashboard/monthly-income-expense');
  return response.data;
};

export const getTransaction = async (): Promise<ApiResponse<Transaction[]>> => {
  const response = await axios.get('/dashboard/transactions');
  return response.data;
};

export const categoryBreakdown = async ({
  from,
  to,
}: {
  from: Date;
  to: Date;
}): Promise<ApiResponse<CategoryBreakdown[]>> => {
  const response = await axios.get('/dashboard/category-breakdown', {
    params: { from, to },
  });
  return response.data;
};
