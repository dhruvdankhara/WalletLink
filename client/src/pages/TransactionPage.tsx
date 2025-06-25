import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  TransactionRecordCard,
  TransactionModel,
} from '@/components';
import type { Transaction } from '@/types/api/transaction.types';
import { TransactionAPI } from '@/api';

const TransactionPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [isTransactionModelOpen, setIsTransactionModelOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await TransactionAPI.getAll({ limit: 20 });
        setTransactions(response.data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase()) ||
      transaction.category.name
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory =
      filterCategory === 'all' || transaction.category.name === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const categories = [
    'all',
    ...new Set(transactions.map((t) => t.category.name)),
  ];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        </div>
        <Button
          onClick={() => {
            setIsTransactionModelOpen(true);
          }}
        >
          Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <p className="text-muted-foreground text-sm">
            {loading
              ? 'Loading...'
              : `Showing ${filteredTransactions.length} of ${transactions.length} transactions`}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? (
              <div className="text-muted-foreground py-8 text-center">
                Loading transactions...
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">
                No transactions found matching your criteria
              </div>
            ) : (
              (() => {
                const groupedTransactions = filteredTransactions.reduce(
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
                      <div className="space-y-2 sm:pl-4">
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
              })()
            )}
          </div>
        </CardContent>
      </Card>

      <TransactionModel
        isOpen={isTransactionModelOpen}
        onClose={() => setIsTransactionModelOpen(false)}
        onCreate={(data) => {
          setTransactions((prev) => [data, ...prev]);
        }}
      />
    </div>
  );
};

export default TransactionPage;
