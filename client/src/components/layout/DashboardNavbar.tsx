import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  User,
  LogOut,
  Settings,
  Home,
  Users,
  Wallet,
  CreditCard,
  FolderOpen,
  ChevronDown,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import toast from 'react-hot-toast';
import { AuthAPI } from '@/api';
import { logout } from '@/store/slices/authSlice';

export function DashboardNavbar() {
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      const response = await AuthAPI.logout();

      if (response.success) {
        dispatch(logout());
        window.location.href = '/login';
      } else {
        toast.error('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <header className="bg-card/50 sticky top-5 z-50 backdrop-blur-sm">
      <div className="container mx-auto mt-6 flex h-16 items-center justify-between rounded-3xl border-2 px-4">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Link
              to="/dashboard"
              className="text-primary hover:text-primary/80 text-xl font-bold transition-colors"
            >
              WalletLink
            </Link>
          </div>

          <nav className="hidden items-center space-x-1 md:flex">
            <NavLink to="/dashboard">
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              )}
            </NavLink>
            <NavLink to="/transactions">
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Transactions</span>
                </Button>
              )}
            </NavLink>
            {data?.role == 'admin' && (
              <NavLink to="/members">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>Members</span>
                  </Button>
                )}
              </NavLink>
            )}
            <NavLink to="/account">
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Wallet className="h-4 w-4" />
                  <span>Account</span>
                </Button>
              )}
            </NavLink>
            <NavLink to="/category">
              {({ isActive }) => (
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <FolderOpen className="h-4 w-4" />
                  <span>Category</span>
                </Button>
              )}
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-12 min-w-auto rounded-full p-0 has-[>svg]:px-2"
              >
                <Avatar className="size-9 p-0">
                  <AvatarImage src={data?.avatar} alt="User avatar" />
                  <AvatarFallback>{`${data?.firstname[0].toUpperCase()}${data?.lastname[0].toUpperCase()}`}</AvatarFallback>
                </Avatar>
                {data?.firstname && data?.lastname && (
                  <span className="hidden md:inline">{`${data.firstname.toUpperCase()} ${data.lastname.toUpperCase()}`}</span>
                )}
                <ChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="end">
              <div className="bg-card/50 flex flex-col gap-1 backdrop-blur-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive/80 w-full justify-start gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
