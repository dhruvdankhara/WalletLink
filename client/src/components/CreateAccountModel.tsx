import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  ColorSelector,
  IconSelector,
} from '@/components';
import { useState } from 'react';
import type { Color } from '@/types/api/color.types';
import type { Icon } from '@/types/api/icon.types';
import { AccountAPI } from '@/api';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import type { Account } from '@/types/api/account.types';

interface CreateAccountModelProps {
  onClose: () => void;
  onCreate: (data: Account) => void;
  isOpen: boolean;
}

const CreateAccountModel = ({
  onClose,
  onCreate,
  isOpen,
}: CreateAccountModelProps) => {
  const [name, setName] = useState('');
  const [initialBalance, setInitialBalance] = useState(0);
  const [selectedColor, setSelectedColor] = useState<Color | undefined>();
  const [selectedIcon, setSelectedIcon] = useState<Icon | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const onColorChange = (color: Color) => {
    setSelectedColor(color);
  };

  const onIconChange = (icon: Icon) => {
    setSelectedIcon(icon);
  };

  const resetForm = () => {
    setName('');
    setInitialBalance(0);
    setSelectedColor(undefined);
    setSelectedIcon(undefined);
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.error('Please enter an account name');
      return false;
    }
    if (initialBalance < 0) {
      toast.error('Initial balance cannot be negative');
      return false;
    }
    if (!selectedColor) {
      toast.error('Please select a color');
      return false;
    }
    if (!selectedIcon) {
      toast.error('Please select an icon');
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

      const accountData = {
        name: name.trim(),
        initialBalance,
        colorId: selectedColor!._id,
        iconId: selectedIcon!._id,
      };

      const response = await AccountAPI.create(accountData);

      toast.success('Account created successfully!');

      resetForm();

      onCreate(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating account:', error);
      toast.error('An error occurred while creating the account');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={isLoading ? undefined : onClose}>
      <DialogContent className="sm:max-w-[425px]">
        {isLoading && (
          <div className="bg-background/80 absolute inset-0 z-50 flex items-center justify-center rounded-lg backdrop-blur-sm">
            <div className="space-y-2 text-center">
              <Loader2 className="text-primary mx-auto h-6 w-6 animate-spin" />
              <p className="text-muted-foreground text-sm">
                Creating account...
              </p>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a New Account</DialogTitle>
          </DialogHeader>
          <div className="my-6 grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="account">Account Name</Label>
              <Input
                id="account"
                name="account"
                placeholder="Enter account name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="initialBalance">Initial Balance</Label>
              <Input
                id="initialBalance"
                name="initialBalance"
                type="number"
                placeholder="Enter initial balance"
                min="0"
                step="0.01"
                value={initialBalance}
                onChange={(e) => setInitialBalance(Number(e.target.value))}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-3">
              <Label>Color</Label>
              <ColorSelector onColorChange={onColorChange} />
            </div>
            <div className="grid gap-3">
              <Label>Icon</Label>
              <IconSelector type="account" onIconChange={onIconChange} />
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
                  Creating...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAccountModel;
