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
import type { AccountWithTransactions } from '@/types/api/account.types';

interface EditAccountModelProps {
  onClose: () => void;
  onEdit: (data: AccountWithTransactions) => void;
  isOpen: boolean;
  account: AccountWithTransactions;
}

const EditAccountModel = ({
  onClose,
  onEdit,
  isOpen,
  account,
}: EditAccountModelProps) => {
  const [name, setName] = useState(account.name);
  const [selectedColor, setSelectedColor] = useState<Color>(account.color);
  const [selectedIcon, setSelectedIcon] = useState<Icon>(account.icon);
  const [isLoading, setIsLoading] = useState(false);

  const onColorChange = (color: Color) => {
    setSelectedColor(color);
  };

  const onIconChange = (icon: Icon) => {
    setSelectedIcon(icon);
  };

  const resetForm = () => {
    setName('');
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.error('Please enter an account name');
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
        colorId: selectedColor!._id,
        iconId: selectedIcon!._id,
      };

      const response = await AccountAPI.updateAccount(account._id, accountData);

      toast.success('Account updated successfully!');

      resetForm();

      onEdit(response.data);
      onClose();
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('An error occurred while updating the account');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={isLoading ? undefined : onClose}>
      <DialogContent className="max-h-10/12 overflow-auto sm:max-w-[425px]">
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
            <DialogTitle>Edit Account</DialogTitle>
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
              <Label>Color</Label>
              <ColorSelector
                onColorChange={onColorChange}
                initialColor={selectedColor}
              />
            </div>

            <div className="grid gap-3">
              <Label>Icon</Label>
              <IconSelector
                type="account"
                onIconChange={onIconChange}
                initialIcon={selectedIcon}
              />
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
                'Update Account'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAccountModel;
