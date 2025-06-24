export interface DashboardMembers {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  avatar: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  familyId: string;
  transactionSummary: {
    _id: string;
    total: number;
  }[];
  income: number;
  expense: number;
}

export interface monthlyIncomeExpense {
  month: string;
  income: number;
  expense: number;
}

export interface CategoryBreakdown {
  totalAmount: number;
  categoryId: string;
  categoryName: string;
}
