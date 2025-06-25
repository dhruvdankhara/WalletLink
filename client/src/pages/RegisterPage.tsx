/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from 'react-router-dom';
import { Button, Input, Label } from '@/components';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { AuthAPI } from '@/api';
import toast from 'react-hot-toast';
import { login } from '@/store/slices/authSlice';
import { useDispatch } from 'react-redux';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm<RegisterFormData>();
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

  const submit = async (data: RegisterFormData) => {
    if (!validatePasswords(data.password, data.confirmPassword)) {
      return;
    }

    try {
      const response = await AuthAPI.register({
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        password: data.password,
      });

      dispatch(login(response.data.user));

      toast.success('Registration successful! Redirecting to Dashboard...');

      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      return;
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="text-muted-foreground">
          Join WalletLink and start managing your family finances
        </p>
      </div>

      <form
        className="space-y-6 rounded-lg border p-6"
        onSubmit={handleSubmit(submit)}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              placeholder="John"
              {...register('firstName', { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              {...register('lastName', { required: true })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register('email', { required: true })}
          />
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

      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
