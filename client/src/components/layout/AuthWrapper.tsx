import { AuthAPI } from '@/api';
import { login } from '@/store/slices/authSlice';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthAPI.me()
      .then((response) => {
        if (response.success) {
          console.log('User data:', response.data);
          dispatch(login(response.data));
        } else {
          console.error('Authentication failed:', response.message);
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <Loader2 className="mx-auto mb-6 h-16 w-16 animate-spin text-gray-800" />
          <h2 className="mb-4 text-center text-xl font-semibold text-gray-800">
            Loading...
          </h2>
          <p className="max-w-md text-center text-sm text-red-500">
            We're using a free backend server. It may take 30-40 seconds to
            restart if it's been idle.
          </p>
        </div>
      </div>
    );
  }

  return <div>{children}</div>;
};

export default AuthWrapper;
