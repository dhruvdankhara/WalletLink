/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  DateRangePicker,
  TransactionRecordCard,
} from '@/components';
import {
  Users,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  ArrowLeftRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useEffect, useState } from 'react';
import { DashboardAPI } from '@/api';
import type { Account } from '@/types/api/account.types';
import { startOfMonth, endOfMonth } from 'date-fns';
import type {
  CategoryBreakdown,
  DashboardMembers,
  monthlyIncomeExpense,
} from '@/types/api/dashboard.types';
import type { Transaction } from '@/types/api/transaction.types';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

type DateRange = {
  from: Date;
  to: Date;
};

export default function DashboardPage() {
  const { data } = useSelector((state: RootState) => state.auth);

  const [members, setMembers] = useState<DashboardMembers[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [date, setDate] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [monthlyData, setMonthlyData] = useState<monthlyIncomeExpense[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<CategoryBreakdown[]>(
    []
  );

  useEffect(() => {
    DashboardAPI.getAllMembers({
      from: date.from,
      to: date.to,
    })
      .then((response) => {
        setMembers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching members:', error);
      });

    DashboardAPI.getAllAccounts()
      .then((response) => {
        setAccounts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching accounts:', error);
      });

    DashboardAPI.getMonthlyIncomeExpense()
      .then((response) => {
        setMonthlyData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching monthly income/expense data:', error);
      });

    DashboardAPI.getTransaction()
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
      });

    DashboardAPI.categoryBreakdown({ from: date.from, to: date.to })
      .then((response) => {
        setExpenseBreakdown(response.data);
      })
      .catch((error) => {
        console.error('Error fetching expense breakdown:', error);
      });
  }, [date]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your family's financial overview.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Transaction
          </Button>
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Account
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeftRight className="h-4 w-4" />
            Transfer
          </Button>
        </div>
      </div>

      <DateRangePicker onChange={(range) => setDate(range)} />

      {/* *** Summary Cards*** */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {data?.role === 'admin' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Members
              </CardTitle>
              <Users className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{members.length}</div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Accounts
            </CardTitle>
            <Wallet className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Balance
            </CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {accounts.reduce(
                (acc, account) => acc + account.currentBalance,
                0
              )}
            </div>
            <p className="text-muted-foreground text-xs">Current net worth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹ {members.reduce((acc, member) => acc + member.income, 0)}
            </div>
            <p className="text-muted-foreground text-xs">
              {date.from.toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
              })}{' '}
              -{' '}
              {date.to.toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ₹{members.reduce((acc, member) => acc + member.expense, 0)}
            </div>
            <p className="text-muted-foreground text-xs">
              {' '}
              {date.from.toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
              })}{' '}
              -{' '}
              {date.to.toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* **** Family Members & Accounts Section *** */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Family Member Summary</CardTitle>
            <p className="text-muted-foreground text-sm">
              Individual financial overview
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members &&
                members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-4 last:border-b-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {member.firstname} {member.lastname}
                        </p>
                        <Badge
                          variant={
                            member.role === 'Admin' ? 'default' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {member.role}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground flex gap-4 text-sm">
                        <span className="text-green-600">
                          Income: {formatCurrency(member.income)}
                        </span>
                        <span className="text-red-600">
                          Expense: {formatCurrency(member.expense)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Accounts */}
        <Card>
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
            <p className="text-muted-foreground text-sm">All family accounts</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accounts.map((account) => (
                <div
                  key={account._id}
                  className="flex items-center justify-between border-b pb-4 last:border-b-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{account.name}</p>

                    <p className="text-muted-foreground text-sm">
                      {account.user.firstname} {account.user.lastname}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(account.currentBalance)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Income vs Expense Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Income vs Expenses</CardTitle>
            <p className="text-muted-foreground text-sm">
              Last {monthlyData.length} months comparison
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />{' '}
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="income" fill="#22C55E" name="Income" />
                <Bar dataKey="expense" fill="#EF4444" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown by Category</CardTitle>
            <p className="text-muted-foreground text-sm">
              {date.from.toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
              })}{' '}
              -{' '}
              {date.to.toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
              })}{' '}
              breakdown
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={(entry: any) => {
                    const total = expenseBreakdown.reduce(
                      (sum, item) => sum + item.totalAmount,
                      0
                    );
                    const percentage =
                      total > 0
                        ? ((entry.totalAmount / total) * 100).toFixed(1)
                        : '0.0';
                    return `${entry.categoryName || ''} (${percentage}%)`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="totalAmount"
                >
                  {expenseBreakdown.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`hsl(${(index * 360) / expenseBreakdown.length}, 70%, 50%)`}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(totalAmount: number) => {
                    const total = expenseBreakdown.reduce(
                      (sum, item) => sum + item.totalAmount,
                      0
                    );
                    const percentage =
                      total > 0
                        ? ((totalAmount / total) * 100).toFixed(1)
                        : '0.0';
                    return [formatCurrency(totalAmount), `${percentage}%`];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <p className="text-muted-foreground text-sm">
            Latest financial activities
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions &&
              (() => {
                const groupedTransactions = transactions.reduce(
                  (groups, transaction) => {
                    const date = formatDate(transaction.datetime.toString());
                    if (!groups[date]) {
                      groups[date] = [];
                    }
                    groups[date].push(transaction);
                    return groups;
                  },
                  {} as Record<string, Transaction[]>
                );

                return Object.entries(groupedTransactions).map(
                  ([date, transactions]) => (
                    <div key={date} className="space-y-2">
                      <h3 className="text-foreground border-b pb-2 text-lg font-semibold">
                        {date}
                      </h3>
                      <div className="space-y-2 pl-4">
                        {transactions.map((transaction) => (
                          <TransactionRecordCard
                            key={transaction._id}
                            transaction={transaction}
                          />
                        ))}
                      </div>
                    </div>
                  )
                );
              })()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
