import { AuthAPI } from '@/api';
import { Button, Input, Label } from '@/components';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useParams } from 'react-router';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  const submit = async (data: ResetPasswordFormData) => {
    setError('');

    if (data.confirmPassword !== data.password) {
      setError('Password and confirm password must be same');
      return;
    }

    setIsSubmitting(true);

    try {
      await AuthAPI.resetPassword(token!, data.password);

      toast.success('Password reset successfully!');

      window.location.href = '/login';
    } catch (error: unknown) {
      console.error('Reset password error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to reset email';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return <div>No token found</div>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Reset your password?</h1>
        <p className="text-muted-foreground">
          Enter your new password and confirm password to change password.
        </p>
      </div>

      <form
        className="space-y-6 rounded-lg border p-6"
        onSubmit={handleSubmit(submit)}
      >
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="password"
            disabled={isSubmitting}
            {...register('password', {
              required: 'password is required',
            })}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmpassword">Confirm Password</Label>
          <Input
            id="confirmpassword"
            type="password"
            placeholder="confirm password"
            disabled={isSubmitting}
            {...register('confirmPassword', {
              required: 'confirm password is required',
            })}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {error !== '' && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'changing...' : 'change password'}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
