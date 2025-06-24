import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { AuthAPI } from '@/api';
import toast from 'react-hot-toast';
import { login } from '../store/slices/authSlice';

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginPage() {
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm<LoginFormData>();

  const submit = async (data: LoginFormData) => {
    try {
      const response = await AuthAPI.login({
        email: data.email,
        password: data.password,
      });

      dispatch(login(response.data.user));

      toast.success('Login successful! Redirecting to Dashboard...');

      window.location.href = '/dashboard';
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';
      toast.error(errorMessage);
      return;
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">
          Sign in to your WalletLink account
        </p>
      </div>

      <form
        className="space-y-6 rounded-lg border p-6"
        onSubmit={handleSubmit(submit)}
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            required
            {...register('email', {
              required: 'Email is required',
            })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            {...register('password', {
              required: 'Password is required',
            })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="remember" className="rounded" />
            <Label htmlFor="remember" className="text-sm">
              Remember me
            </Label>
          </div>
          <Link
            to="/forgot-password"
            className="text-primary text-sm hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>

      <div className="space-y-4 text-center">
        <p className="text-muted-foreground text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
