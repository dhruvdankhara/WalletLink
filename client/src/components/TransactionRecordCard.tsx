import type { Transaction } from '@/types/api/transaction.types';
import { ArrowDown, ArrowUp, Clock, User } from 'lucide-react';
import { Badge, Button, Card, CardContent } from '@/components';
import { Link } from 'react-router';

const TransactionRecordCard = ({
  transaction,
}: {
  transaction: Transaction;
}) => {
  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeColor = (type: string) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Link to={`/transactions/${transaction._id}`} className="block">
      <Card className="cursor-pointer transition-all duration-200 hover:shadow-md">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            {/* Left Section */}
            <div className="flex flex-1 items-center space-x-3 sm:space-x-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-sm sm:h-12 sm:w-12 ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {transaction.type === 'income' ? (
                  <ArrowDown className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
                ) : (
                  <ArrowUp className="h-5 w-5 text-red-600 sm:h-6 sm:w-6" />
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1 sm:space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                  <div className="flex items-center space-x-2">
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-lg sm:h-8 sm:w-8"
                      style={{
                        backgroundColor: `${transaction.category.color.hex}20`,
                        border: `1px solid ${transaction.category.color.hex}`,
                      }}
                    >
                      <img
                        src={transaction.category.icon?.url}
                        alt={transaction.category.name}
                        className="h-3 w-3 sm:h-5 sm:w-5"
                      />
                    </div>
                    <h3 className="truncate text-base font-semibold sm:text-lg">
                      {transaction.category.name}
                    </h3>
                  </div>
                  {transaction.description && (
                    <span className="text-muted-foreground truncate text-xs sm:text-sm">
                      • {transaction.description}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm sm:gap-4">
                  <div className="flex items-center space-x-1">
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor: transaction.account.color.hex,
                        backgroundColor: `${transaction.account.color.hex}10`,
                      }}
                    >
                      <img
                        src={transaction.account.icon?.url}
                        alt={transaction.account.name}
                        className="mr-1 h-3 w-3"
                      />
                      <span className="max-w-20 truncate sm:max-w-none">
                        {transaction.account.name}
                      </span>
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-1">
                    <User className="text-muted-foreground h-3 w-3" />
                    <Badge variant="outline" className="text-xs">
                      <span className="max-w-20 truncate sm:max-w-none">
                        {transaction.user.firstname} {transaction.user.lastname}
                      </span>
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Clock className="text-muted-foreground h-3 w-3" />
                    <span className="text-muted-foreground text-xs">
                      {formatDateTime(transaction.datetime)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section  */}
            <div className="mt-2 flex items-center justify-between sm:mt-0 sm:justify-end sm:space-x-4">
              <div className="text-left sm:text-right">
                <p
                  className={`text-lg font-bold sm:text-xl ${getTypeColor(transaction.type)}`}
                >
                  {transaction.type === 'income' ? '+' : '-'}₹
                  {transaction.amount.toFixed(2)}
                </p>
                <Badge
                  className={`text-xs ${
                    transaction.type === 'income'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {transaction.type.toUpperCase()}
                </Badge>
              </div>

              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  View
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TransactionRecordCard;
