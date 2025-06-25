import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '@/components';

export function PublicLayout() {
  return (
    <div className="bg-background min-h-screen">
      <PublicNavbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
