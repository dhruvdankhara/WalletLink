import { Link } from 'react-router-dom';
import { Button } from '@/components';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
          <span className="text-4xl text-gray-400">404</span>
        </div>

        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Page Not Found
        </h1>

        <p className="mb-8 text-lg text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex justify-center space-x-4">
          <Button asChild>
            <Link to="/" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
