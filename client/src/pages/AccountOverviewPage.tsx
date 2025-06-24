import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  Activity,
  MoreVertical,
  Download,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
import type { AccountWithTransactions } from '@/types/api/account.types';
import { AccountAPI, TransactionAPI } from '@/api';
import TransactionRecordCard from '@/components/TransactionRecordCard';
import type { Transaction } from '@/types/api/transaction.types';

const AccountDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [account, setAccount] = useState<AccountWithTransactions | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  // const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) {
      toast.error('Account ID is required');
      navigate('/account');
      return;
    }

    setIsLoading(true);

    AccountAPI.getAccountById(id)
      .then((response) => {
        setAccount(response.data);
      })
      .catch((error) => {
        console.error('Error fetching account:', error);
        toast.error('Failed to load account details');
      })
      .finally(() => {
        setIsLoading(false);
      });

    TransactionAPI.getAll({ accountId: id })
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [id, navigate]);

  const handleEdit = () => {
    toast.error('Edit feature is coming soon!');
  };

  // const handleDelete = async () => {
  //   toast.error('Delete feature is coming soon!');
  // };

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-muted h-10 w-10 animate-pulse rounded-lg" />
            <div className="space-y-2">
              <div className="bg-muted h-8 w-48 animate-pulse rounded" />
              <div className="bg-muted h-4 w-32 animate-pulse rounded" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-muted h-32 animate-pulse rounded-lg" />
            ))}
          </div>

          <div className="bg-muted h-96 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4 text-center">
          <h1 className="text-muted-foreground text-2xl font-bold">
            Account Not Found
          </h1>
          <p className="text-muted-foreground">
            The account you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/account')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Accounts
          </Button>
        </div>
      </div>
    );
  }

  const balanceChange = account.currentBalance - account.initialBalance;

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-lg"
              style={{
                backgroundColor: `${account.color.hex}20`,
                border: `2px solid ${account.color.hex}`,
              }}
            >
              <img
                src={account.icon.url}
                alt={account.icon.name}
                className="h-6 w-6"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{account.name}</h1>
              <p className="text-muted-foreground">
                Created on {formatDate(account.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit3 className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <Button
            variant="outline"
            size="sm"
            // onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Share Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Balance
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
            >
              {isBalanceVisible ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isBalanceVisible ? `₹${account.currentBalance}` : '••••••'}
            </div>
            <p className="text-muted-foreground text-xs">
              Initial: ₹{account.initialBalance}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +₹
              {transactions
                .filter((transaction) => transaction.type === 'income')
                .reduce((sum, transaction) => sum + transaction.amount, 0)}
            </div>
            <p className="text-muted-foreground text-xs">
              From{' '}
              {
                transactions.filter(
                  (transaction) => transaction.type === 'income'
                ).length
              }{' '}
              income transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expense</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              -₹
              {transactions
                .filter((transaction) => transaction.type === 'expense')
                .reduce((sum, transaction) => sum + transaction.amount, 0)}
            </div>
            <p className="text-muted-foreground text-xs">
              From{' '}
              {
                transactions.filter(
                  (transaction) => transaction.type === 'expense'
                ).length
              }{' '}
              expense transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
            {balanceChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${balanceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {balanceChange >= 0 ? '+' : ''}₹{balanceChange}
            </div>
            <p className="text-muted-foreground text-xs">Income - Expense</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions &&
              (() => {
                const groupedTransactions = transactions.reduce(
                  (groups, transaction) => {
                    const date = formatDate(new Date(transaction.datetime));
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

          <div className="mt-6 text-center">
            <Button variant="outline">View All Transactions</Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      {/* <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this account?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              account "{account.name}" and all of its transaction history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </div>
  );
};

export default AccountDetailsPage;
