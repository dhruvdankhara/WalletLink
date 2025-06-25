import { Outlet } from 'react-router-dom';
import { DashboardNavbar } from '@/components';

export function DashboardLayout() {
  return (
    <div className="bg-background min-h-screen">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
