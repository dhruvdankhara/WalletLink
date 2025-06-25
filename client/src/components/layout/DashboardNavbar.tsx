import { Link, NavLink } from 'react-router-dom';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components';
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
  Menu,
  X,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import type { RootState } from '@/store/store';
import toast from 'react-hot-toast';
import { AuthAPI } from '@/api';
import { logout } from '@/store/slices/authSlice';
import logo from '@/assets/logo.png';

export function DashboardNavbar() {
  const dispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/transactions', icon: CreditCard, label: 'Transactions' },
    ...(data?.role === 'admin'
      ? [{ to: '/members', icon: Users, label: 'Members' }]
      : []),
    { to: '/account', icon: Wallet, label: 'Account' },
    { to: '/category', icon: FolderOpen, label: 'Category' },
  ];
  return (
    <>
      <header className="bg-card/50 sticky top-5 z-50 backdrop-blur-sm">
        <div className="mx-4 mt-6 flex h-16 items-center justify-between rounded-3xl border-2 px-4 md:container md:mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link
              to="/dashboard"
              className="text-primary hover:text-primary/80 text-xl font-bold transition-colors"
              onClick={closeMobileMenu}
            >
              <img src={logo} alt="WalletLink" className="h-10" />
            </Link>
          </div>

          {/* large screen  */}
          <nav className="hidden items-center space-x-1 md:flex">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to}>
                {({ isActive }) => (
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Button>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            {/* Mobile  */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

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
                    <span className="hidden lg:inline">{`${data.firstname.toUpperCase()} ${data.lastname.toUpperCase()}`}</span>
                  )}
                  <ChevronDown className="hidden sm:block" />
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          <div className="bg-card/95 fixed top-24 right-0 left-0 mx-4 rounded-2xl border-2 backdrop-blur-md">
            <nav className="flex flex-col space-y-2 p-4">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink key={to} to={to} onClick={closeMobileMenu}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      size="lg"
                      className="w-full justify-start space-x-3"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{label}</span>
                    </Button>
                  )}
                </NavLink>
              ))}

              <div className="mt-2 border-t pt-2">
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full justify-start space-x-3"
                  onClick={closeMobileMenu}
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full justify-start space-x-3"
                  onClick={closeMobileMenu}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-destructive hover:text-destructive/80 w-full justify-start space-x-3"
                  onClick={() => {
                    closeMobileMenu();
                    handleLogout();
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
