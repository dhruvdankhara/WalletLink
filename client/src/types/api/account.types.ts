import type { User } from './auth.types';
import type { Color } from './color.types';
import type { Family } from './family.types';
import type { Icon } from './icon.types';

export interface Account {
  _id: string;
  name: string;
  initialBalance: number;
  currentBalance: number;
  user: User;
  family: Family;
  icon: Icon;
  color: Color;
  userId: string;
  familyId: string;
  iconId: string;
  colorId: string;
  createdAt: Date;
}

export interface AccountWithTransactions extends Account {
  income: number;
  expenses: number;
}

export interface CreateAccountRequest {
  name: string;
  initialBalance: number;
  iconId: string;
  colorId: string;
}

export interface UpdateAccountRequest {
  name?: string;
  initialBalance?: number;
  iconId?: string;
  colorId?: string;
}
