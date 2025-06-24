import type { Transaction } from '@/types/api/transaction.types';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { ChevronDownIcon, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AccountAPI, CategoryAPI, TransactionAPI } from '@/api';
import { Input } from './ui/input';
import { Label } from '@radix-ui/react-label';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Account } from '@/types/api/account.types';
import type { Category } from '@/types/api/category.type';
import { Textarea } from './ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';

interface EditTransactionModelProps {
  onClose: () => void;
  onUpdate: (data: Transaction) => void;
  isOpen: boolean;
  transaction: Transaction;
}

const EditTransactionModel = ({
  onClose,
  onUpdate,
  isOpen,
  transaction,
}: EditTransactionModelProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [type, setType] = useState<'income' | 'expense'>(transaction.type);
  const [selectedAccount, setSelectedAccount] = useState<string>(
    transaction.account._id
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    transaction.category._id
  );
  const [amount, setAmount] = useState<number>(transaction.amount);
  const [description, setDescription] = useState<string>(
    transaction.description || ''
  );

  const transactionDate = new Date(transaction.datetime);
  const [selectedTime, setSelectedTime] = useState<string>(
    transactionDate.toTimeString().substring(0, 5)
  );
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(transactionDate);

  const validateForm = () => {
    if (!selectedAccount) {
      toast.error('Please select a wallet');
      return false;
    }

    if (!selectedCategory) {
      toast.error('Please select a category');
      return false;
    }

    if (amount <= 0) {
      toast.error('Please enter a valid amount');
      return false;
    }

    if (!date) {
      toast.error('Please select a date');
      return false;
    }

    if (!selectedTime) {
      toast.error('Please select a time');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const datetime = new Date(
        date?.getFullYear() ?? 0,
        date?.getMonth() ?? 0,
        date?.getDate() ?? 1,
        parseInt(selectedTime.split(':')[0]),
        parseInt(selectedTime.split(':')[1])
      );

      const response = await TransactionAPI.updateTransaction(transaction._id, {
        amount,
        accountId: selectedAccount,
        categoryId: selectedCategory,
        type,
        datetime,
        description,
      });

      toast.success('Transaction updated successfully!');

      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('An error occurred while updating the transaction');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    AccountAPI.getAll()
      .then((response) => {
        setAccounts(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch accounts:', error);
        toast.error('Failed to fetch accounts');
      });

    CategoryAPI.getAll()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to fetch categories');
      });
  }, []);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={isLoading ? undefined : onClose}>
      <DialogContent className="sm:max-w-3xl">
        {isLoading && (
          <div className="bg-background/80 absolute inset-0 z-50 flex items-center justify-center rounded-lg backdrop-blur-sm">
            <div className="space-y-2 text-center">
              <Loader2 className="text-primary mx-auto h-6 w-6 animate-spin" />
              <p className="text-muted-foreground text-sm">
                updating transaction...
              </p>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-5">
            <div className="my-6 grid gap-6 sm:col-span-3">
              <div className="grid gap-3">
                <Label htmlFor="title">Type</Label>
                <RadioGroup
                  defaultValue={type}
                  className="flex items-center"
                  onValueChange={(value) => {
                    if (value === 'income' || value === 'expense') {
                      setType(value);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="income" id="income" />
                    <Label htmlFor="income">Income</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="expense" id="expense" />
                    <Label htmlFor="expense">Expense</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Account  */}
              <div className="grid gap-3">
                <Label htmlFor="wallet">Select Wallet</Label>
                <Select
                  onValueChange={setSelectedAccount}
                  value={selectedAccount}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a wallet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Wallets</SelectLabel>
                      {accounts &&
                        accounts.length > 0 &&
                        accounts.map((account) => (
                          <SelectItem key={account._id} value={account._id}>
                            <img
                              src={`${account.icon.url}?color=%23ffffff`}
                              className="mr-2 size-8 rounded-lg p-1"
                              style={{
                                backgroundColor: `${account.color.hex}`,
                              }}
                            />
                            {account.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="grid gap-3">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="Enter transaction amount"
                  value={amount === 0 ? '' : amount}
                  onChange={(e) =>
                    setAmount(
                      e.target.value === '' ? 0 : Number(e.target.value)
                    )
                  }
                  disabled={isLoading}
                />
              </div>

              {/* Category  */}
              <div className="grid gap-3">
                <Label htmlFor="wallet">Category</Label>
                <Select
                  onValueChange={setSelectedCategory}
                  value={selectedCategory}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      {categories &&
                        categories.length > 0 &&
                        categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            <img
                              src={`${category.icon.url}?color=%23ffffff`}
                              className="mr-2 size-8 rounded-lg p-1"
                              style={{
                                backgroundColor: `${category.color.hex}`,
                              }}
                            />
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="my-6 grid gap-6 sm:col-span-2">
              <div className="flex flex-col gap-3">
                <Label htmlFor="date-picker" className="px-1">
                  Date
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date-picker"
                      className="w-full justify-between font-normal"
                    >
                      {date ? formatDate(date) : 'Select date'}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setDate(date);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="time-picker" className="px-1">
                  Time
                </Label>
                <Input
                  type="time"
                  id="time-picker"
                  step="1"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  disabled={isLoading}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>

              {/* Description */}
              <div className="grid gap-3">
                <Label htmlFor="description">Note</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter transaction note"
                  className="resize-none"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Transaction'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionModel;
