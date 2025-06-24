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
import type { User } from '@/types/api/auth.types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface CreateAccountModelProps {
  onClose: () => void;
  isOpen: boolean;
  member: User;
  onUpdate: (updatedMember: User) => void;
}

const EditMemberModel = ({
  onClose,
  isOpen,
  member,
  onUpdate,
}: CreateAccountModelProps) => {
  const [firstname, setFirstname] = useState(member.firstname);
  const [lastname, setLastname] = useState(member.lastname);
  const [email, setEmail] = useState(member.email);
  const [role, setRole] = useState(member.role || 'member');
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setEmail(member.email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await MemberAPI.updateMember(member._id, {
        firstname,
        lastname,
        email,
        role,
      });

      toast.success('Member updated successfully!');

      onUpdate(response.data);

      resetForm();
      onClose();
    } catch (error: any) {
      console.log(error.message);

      const errorMsg =
        error.message ||
        error?.response?.data?.message ||
        'An error occurred while adding the member';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isLoading ? undefined : onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {isLoading && (
          <div className="bg-background/80 absolute inset-0 z-50 flex items-center justify-center rounded-lg backdrop-blur-sm">
            <div className="space-y-2 text-center">
              <Loader2 className="text-primary mx-auto h-6 w-6 animate-spin" />
              <p className="text-muted-foreground text-sm">
                Updating member...
              </p>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          <div className="my-6 grid gap-6">
            <div className="flex gap-4">
              <div className="grid gap-3">
                <Label htmlFor="email">First Name</Label>
                <Input
                  id="firstname"
                  name="firstname"
                  placeholder="Enter first name"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Last Name</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  placeholder="Enter Last name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
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
            </div>
            <div className="grid gap-3">
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as 'member' | 'admin')}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
                  Editing...
                </>
              ) : (
                'Edit Member'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberModel;
