import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  TransactionRecordCard,
  TransactionModel,
  PageSizeSelector,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components';
import type { Transaction } from '@/types/api/transaction.types';
import type { PaginatedResponse } from '@/types/response';
import { TransactionAPI } from '@/api';

const TransactionPage = () => {
  const [paginatedData, setPaginatedData] =
    useState<PaginatedResponse<Transaction> | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isTransactionModelOpen, setIsTransactionModelOpen] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await TransactionAPI.getAll({
          limit: itemsPerPage,
          page: currentPage,
        });
        setPaginatedData(response);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        setPaginatedData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);
  const transactions = paginatedData?.data || [];
  const pagination = paginatedData?.pagination;

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
      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>{' '}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? (
              <div className="text-muted-foreground py-8 text-center">
                Loading transactions...
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">
                No transactions found matching your criteria
              </div>
            ) : (
              (() => {
                const groupedTransactions = transactions.reduce(
                  (
                    groups: Record<string, Transaction[]>,
                    transaction: Transaction
                  ) => {
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
                  ([date, transactionsList]: [string, Transaction[]]) => (
                    <div key={date} className="space-y-2">
                      <h3 className="text-foreground border-b pb-2 text-lg font-semibold">
                        {date}
                      </h3>
                      <div className="space-y-2 sm:pl-4">
                        {' '}
                        {transactionsList.map((transaction: Transaction) => (
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
      {/* Pagination  */}
      {pagination && !loading && (
        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row">
          <div className="flex items-center justify-center sm:justify-start">
            <PageSizeSelector
              pageSize={itemsPerPage}
              onPageSizeChange={setItemsPerPage}
            />
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.hasPrev)
                        setCurrentPage(pagination.currentPage - 1);
                    }}
                    className={
                      !pagination.hasPrev
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>

                {(() => {
                  const pages = [];
                  const totalPages = pagination.totalPages;
                  const currentPage = pagination.currentPage;

                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    pages.push(1);

                    if (currentPage > 4) {
                      pages.push('...');
                    }

                    const start = Math.max(2, currentPage - 1);
                    const end = Math.min(totalPages - 1, currentPage + 1);

                    for (let i = start; i <= end; i++) {
                      pages.push(i);
                    }

                    if (currentPage < totalPages - 3) {
                      pages.push('...');
                    }

                    if (totalPages > 1) {
                      pages.push(totalPages);
                    }
                  }

                  return pages.map((page, index) => (
                    <PaginationItem key={index}>
                      {page === '...' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(Number(page));
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ));
                })()}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.hasNext)
                        setCurrentPage(pagination.currentPage + 1);
                    }}
                    className={
                      !pagination.hasNext
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          <div className="text-muted-foreground text-sm">
            Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{' '}
            to{' '}
            {Math.min(
              pagination.currentPage * pagination.itemsPerPage,
              pagination.totalItems
            )}{' '}
            of {pagination.totalItems} transactions
          </div>
        </div>
      )}
      <TransactionModel
        isOpen={isTransactionModelOpen}
        onClose={() => setIsTransactionModelOpen(false)}
        onCreate={(data) => {
          setPaginatedData((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              data: [data, ...prev.data],
            };
          });
        }}
      />
    </div>
  );
};

export default TransactionPage;
