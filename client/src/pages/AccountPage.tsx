import { AccountAPI } from '@/api';
import { Button, CreateAccountModel } from '@/components';
import type { Account } from '@/types/api/account.types';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Plus, Wallet, Banknote } from 'lucide-react';
import { Link } from 'react-router';

export default function AccountPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoading(true);
        const response = await AccountAPI.getAll();

        if (response.success) {
          setAccounts(response.data);
          toast.success(`Loaded ${response.data.length} accounts successfully`);
        } else {
          toast.error(response.message || 'Failed to fetch accounts');
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
        toast.error('An error occurred while fetching accounts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleCreateAccount = async (data: Account) => {
    setAccounts((prev) => [...prev, data]);
    setIsCreateModalOpen(false);
  };

  const handleAddAccount = () => {
    setIsCreateModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="space-y-4 text-center">
          <Loader2 className="text-primary mx-auto h-8 w-8 animate-spin" />
          <div>
            <h3 className="text-lg font-semibold">Loading Accounts</h3>
            <p className="text-muted-foreground">
              Please wait while we fetch your accounts...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="text-muted-foreground">
            Manage your financial accounts and track balances.
          </p>
        </div>
        <Button onClick={handleAddAccount} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </div>

      {/* Summary Cards */}
      {accounts.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <div className="mb-2 flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              <span className="text-sm font-medium opacity-90">
                Total Accounts
              </span>
            </div>
            <p className="text-2xl font-bold">{accounts.length}</p>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
            <div className="mb-2 flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              <span className="text-sm font-medium opacity-90">
                Total Balance
              </span>
            </div>
            <p className="text-2xl font-bold">
              ₹{' '}
              {accounts
                .reduce((sum, account) => sum + account.currentBalance, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {accounts.length === 0 && !isLoading ? (
        <div className="py-12 text-center">
          <div className="bg-muted/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Wallet className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No accounts found</h3>
          <p className="text-muted-foreground mb-6">
            Get started by adding your first financial account.
          </p>
          <Button onClick={handleAddAccount} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Account
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <Link
              to={account._id}
              key={account._id}
              className="bg-card border-border hover:border-primary/20 rounded-xl border p-6 transition-all duration-200 hover:shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-sm`}
                    style={{
                      backgroundColor: `${account.color.hex}20`,
                      border: `2px solid ${account.color.hex}`,
                    }}
                  >
                    <img
                      src={account.icon.url}
                      alt={account.name}
                      className="h-6 w-6"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{account.name}</h3>
                    <p className="text-muted-foreground text-sm">Account</p>
                  </div>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-foreground text-2xl font-bold">
                  ₹ {account.currentBalance.toFixed(2)}
                </p>
                <p className="text-muted-foreground text-sm">
                  Available Balance
                </p>
              </div>
            </Link>
          ))}

          {/* Add Account Card */}
          <div
            className="bg-card border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/25 group flex cursor-pointer items-center justify-center rounded-xl border border-dashed p-6 transition-all duration-200"
            onClick={handleAddAccount}
          >
            <div className="space-y-4 text-center">
              <div className="bg-primary/10 group-hover:bg-primary/20 mx-auto flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
                <Plus className="text-primary h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Add New Account</h3>
                <p className="text-muted-foreground text-sm">
                  Connect a new financial account
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <CreateAccountModel
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateAccount}
        isOpen={isCreateModalOpen}
      />
    </div>
  );
}
