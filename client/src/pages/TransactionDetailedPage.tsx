import { TransactionAPI } from '@/api';
import type { Transaction } from '@/types/api/transaction.types';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  EditTransactionModel,
} from '@/components';
import {
  ArrowLeft,
  Calendar,
  User,
  CreditCard,
  Tag,
  FileText,
  Clock,
  Trash2,
  Edit3,
} from 'lucide-react';
import toast from 'react-hot-toast';

const TransactionDetailedPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await TransactionAPI.getTransactionById(id);
        setTransaction(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);
  const handleDeleteTransaction = async () => {
    if (!transaction?._id) return;

    try {
      setIsDeleting(true);

      await TransactionAPI.deleteTransaction(id!);

      toast.success('Transaction deleted successfully');
      navigate(-1);
    } catch (err) {
      console.error('Error deleting transaction:', err);
      toast.error('Failed to delete transaction');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditTransaction = () => {
    setIsEditModalOpen(true);
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransaction(updatedTransaction);
    toast.success('Transaction updated successfully');
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeColor = (type: string) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">
            Loading transaction details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span className="text-xl text-red-600">⚠️</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                Error Loading Transaction
              </h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Transactions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <span className="text-xl text-gray-600">🔍</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                Transaction Not Found
              </h3>
              <p className="text-muted-foreground mb-4">
                The transaction you're looking for doesn't exist.
              </p>
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Transactions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Transaction Details</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end">
          <Button variant="outline" onClick={handleEditTransaction}>
            <Edit3 className="mr-2 h-4 w-4" />
            Edit Transaction
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Transaction</AlertDialogTitle>{' '}
                <AlertDialogDescription>
                  Are you sure you want to delete this transaction? This action
                  cannot be undone.
                  <br />
                  <br />
                  <strong>Description:</strong>{' '}
                  {transaction?.description || 'No description'}
                  <br />
                  <strong>Category:</strong> {transaction?.category?.name}
                  <br />
                  <strong>Amount:</strong> ₹{transaction?.amount.toFixed(2)}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteTransaction}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Transaction'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Transaction Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Amount */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    transaction.type === 'income'
                      ? 'bg-green-100'
                      : 'bg-red-100'
                  }`}
                >
                  <span className="text-lg">
                    {transaction.type === 'income' ? '💰' : '💸'}
                  </span>
                </div>
                <span>Transaction Amount</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-4 text-center">
                <p
                  className={`text-4xl font-bold ${getTypeColor(transaction.type)}`}
                >
                  {transaction.type === 'income' ? '+' : '-'}₹
                  {transaction.amount.toFixed(2)}
                </p>
                <Badge
                  className={`mt-2 ${
                    transaction.type === 'income'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {transaction.type.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Date & Time</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-muted-foreground text-sm">
                  Transaction Date
                </p>
                <p className="font-medium">
                  {formatDateTime(transaction.datetime)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center space-x-1 text-sm">
                  <Clock className="h-3 w-3" />
                  <span>Created</span>
                </p>
                <p className="font-medium">
                  {formatDateTime(transaction.createdAt)}
                </p>
              </div>
              {transaction.updatedAt &&
                new Date(transaction.updatedAt).getTime() !==
                  new Date(transaction.createdAt).getTime() && (
                  <div>
                    <p className="text-muted-foreground flex items-center space-x-1 text-sm">
                      <Clock className="h-3 w-3" />
                      <span>Last Updated</span>
                    </p>
                    <p className="font-medium">
                      {formatDateTime(transaction.updatedAt)}
                    </p>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Description</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">
                {transaction.description || 'No description provided'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Tag className="h-5 w-5" />
                <span>Category</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl shadow-sm"
                  style={{
                    backgroundColor: `${transaction.category?.color?.hex}20`,
                    border: `2px solid ${transaction.category?.color?.hex}`,
                  }}
                >
                  {transaction.category?.icon?.url && (
                    <img
                      src={transaction.category.icon.url}
                      alt={transaction.category.name}
                      className="h-6 w-6"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold">
                    {transaction.category?.name}
                  </p>
                  <p className="text-muted-foreground text-sm">Category</p>
                  {transaction.category?.color?.hex && (
                    <div className="mt-1 flex items-center space-x-2">
                      <div
                        className="h-3 w-3 rounded-full border"
                        style={{
                          backgroundColor: transaction.category.color.hex,
                        }}
                      />
                      <span className="text-muted-foreground text-xs">
                        {transaction.category.color.hex}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Account</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl shadow-sm"
                  style={{
                    backgroundColor: `${transaction.account?.color?.hex}20`,
                    border: `2px solid ${transaction.account?.color?.hex}`,
                  }}
                >
                  {transaction.account?.icon?.url && (
                    <img
                      src={transaction.account.icon.url}
                      alt={transaction.account.name}
                      className="h-6 w-6"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold">
                    {transaction.account?.name}
                  </p>
                  <p className="text-muted-foreground text-sm">Account</p>
                  {transaction.account?.color?.hex && (
                    <div className="mt-1 flex items-center space-x-2">
                      <div
                        className="h-3 w-3 rounded-full border"
                        style={{
                          backgroundColor: transaction.account.color.hex,
                        }}
                      />
                      <span className="text-muted-foreground text-xs">
                        {transaction.account.color.hex}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>User</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                {transaction.user?.avatar ? (
                  <img
                    src={transaction.user.avatar}
                    alt={`${transaction.user.firstname} ${transaction.user.lastname}`}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                    <span className="flex size-8 items-center justify-center text-sm font-medium">
                      {transaction.user?.firstname?.[0]}
                      {transaction.user?.lastname?.[0]}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium">
                    {transaction.user?.firstname} {transaction.user?.lastname}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {transaction.user?.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {transaction.attachments && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {transaction.attachments}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Transaction Modal */}
      {transaction && (
        <EditTransactionModel
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdateTransaction}
          transaction={transaction}
        />
      )}
    </div>
  );
};

export default TransactionDetailedPage;
