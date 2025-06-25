import { Link } from 'react-router-dom';
import { Button } from '@/components';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import logo from '@/assets/logo.png';

export function PublicNavbar() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  return (
    <header className="bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="text-primary hover:text-primary/80 text-2xl font-bold transition-colors"
          >
            <img src={logo} alt="" className="h-10" />
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <Link to="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
