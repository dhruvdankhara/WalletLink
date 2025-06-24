/* eslint-disable @typescript-eslint/no-explicit-any */
import { MemberAPI } from '@/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Check } from 'lucide-react';

interface CreateAccountModelProps {
  onClose: () => void;
  isOpen: boolean;
}

const AddMemberModel = ({ onClose, isOpen }: CreateAccountModelProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [isSuccessModelOpen, setIsSuccessModelOpen] = useState(false);

  const resetForm = () => {
    setEmail('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      toast.error('Please enter an email');
      setError('Email is required');
      return false;
    }

    try {
      setIsLoading(true);

      await MemberAPI.create(email);

      toast.success('Email sent successfully!');

      setIsSuccessModelOpen(true);

      resetForm();
      onClose();
    } catch (error: any) {
      console.log(error.message);

      const errorMsg =
        error.message ||
        error?.response?.data?.message ||
        'An error occurred while adding the member';
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={isLoading ? undefined : onClose}>
        <DialogContent className="sm:max-w-[425px]">
          {isLoading && (
            <div className="bg-background/80 absolute inset-0 z-50 flex items-center justify-center rounded-lg backdrop-blur-sm">
              <div className="space-y-2 text-center">
                <Loader2 className="text-primary mx-auto h-6 w-6 animate-spin" />
                <p className="text-muted-foreground text-sm">
                  Adding member...
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
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
                    Adding...
                  </>
                ) : (
                  'Add Member'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isSuccessModelOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Email Sent Successfully</DialogTitle>
          </DialogHeader>
          <div className="my-6 space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-foreground text-lg">
              Invitation sent! Please check email to join the family.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setIsSuccessModelOpen(false)}>
              Okay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddMemberModel;
