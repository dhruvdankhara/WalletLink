/* eslint-disable @typescript-eslint/no-explicit-any */
import { MemberAPI } from '@/api';
import { Button, Input, Label } from '@/components';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router';

interface AcceptInviteData {
  firstname: string;
  lastname: string;
  password: string;
  confirmPassword: string;
}

const InviteAccept = () => {
  const navigate = useNavigate();

  const data = useSearchParams();
  const token = data[0].get('token');

  const { register, handleSubmit } = useForm<AcceptInviteData>();
  const [passwordError, setPasswordError] = useState('');

  const validatePasswords = (
    password: string,
    confirmPassword: string
  ): boolean => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }

    setPasswordError('');
    return true;
  };

  const submit = async (data: AcceptInviteData) => {
    if (!validatePasswords(data.password, data.confirmPassword)) {
      return;
    }

    try {
      await MemberAPI.acceptInvite(token!, {
        firstname: data.firstname,
        lastname: data.lastname,
        password: data.password,
      });

      toast.success('Registration successful! Redirection to Login...');

      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      return;
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-500">Invalid or missing invitation token.</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-2xl px-4 py-6">
        <div className="mb-8 text-center">
          <h1 className="text-foreground mb-2 text-3xl font-bold">
            Accept Invitation
          </h1>
          <p className="text-muted-foreground">
            Complete your registration to join your family!
          </p>
        </div>
        <form
          className="space-y-6 rounded-lg border p-6"
          onSubmit={handleSubmit(submit)}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstname">First name</Label>
              <Input
                id="firstname"
                placeholder="John"
                {...register('firstname', { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Last name</Label>
              <Input
                id="lastname"
                placeholder="Doe"
                {...register('lastname', { required: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password', { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword', { required: true })}
            />
          </div>

          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}

          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
};

export default InviteAccept;
