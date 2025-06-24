import type { Account } from './account.types';
import type { User } from './auth.types';
import type { Category } from './category.type';

export interface Transaction {
  _id: string;
  amount: number;
  description: string;
  userId: string;
  accountId: string;
  familyId: string;
  categoryId: string;
  type: 'income' | 'expense';
  datetime: Date;
  attachments: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  account: Account;
  category: Category;
}

export interface CreateTransactionRequest {
  amount: number;
  description: string;
  accountId: string;
  categoryId: string;
  type: 'income' | 'expense';
  datetime: Date;
  attachments?: string | null;
}
