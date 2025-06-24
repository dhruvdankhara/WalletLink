import type { Transaction } from '@/types/api/transaction.types';
import { ArrowDown, ArrowUp, Clock, User } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
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
        <CardContent>
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex flex-1 items-center space-x-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-sm ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {transaction.type === 'income' ? (
                  <ArrowDown className="h-6 w-6 text-green-600" />
                ) : (
                  <ArrowUp className="h-6 w-6 text-red-600" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: `${transaction.category.color.hex}20`,
                        border: `1px solid ${transaction.category.color.hex}`,
                      }}
                    >
                      <img
                        src={transaction.category.icon?.url}
                        alt={transaction.category.name}
                        className="h-5 w-5"
                      />
                    </div>
                    <h3 className="text-lg font-semibold">
                      {transaction.category.name}
                    </h3>
                  </div>
                  {transaction.description && (
                    <span className="text-muted-foreground text-sm">
                      • {transaction.description}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm">
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
                      {transaction.account.name}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-1">
                    <User className="text-muted-foreground h-3 w-3" />
                    <Badge variant="outline" className="text-xs">
                      {transaction.user.firstname} {transaction.user.lastname}
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
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p
                  className={`text-xl font-bold ${getTypeColor(transaction.type)}`}
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
                <Button variant="outline" size="sm">
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
