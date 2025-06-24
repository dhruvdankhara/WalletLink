import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { MembersPage } from '@/pages/MembersPage';
import { AccountPage } from '@/pages/AccountPage';
import AccountOverviewPage from './pages/AccountOverviewPage';
import InviteAccept from './pages/InviteAccept';
import CategoryPage from './pages/CategoryPage';
import TransactionPage from './pages/TransactionPage';
import TransactionDetailedPage from './pages/TransactionDetailedPage';
import MembersOverviewPage from './pages/MembersOverviewPage';
import PrivateRoute from './components/PrivateRoute';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route
          index
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route path="members" element={<MembersPage />} />
        <Route path="account" element={<AccountPage />} />
      </Route>

      <Route
        path="/transactions"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<TransactionPage />} />
        <Route path=":id" element={<TransactionDetailedPage />} />
      </Route>

      <Route
        path="/members"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<MembersPage />} />
        <Route path=":id" element={<MembersOverviewPage />} />
      </Route>

      <Route
        path="/account"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AccountPage />} />
        <Route path=":id" element={<AccountOverviewPage />} />
      </Route>

      <Route
        path="/category"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<CategoryPage />} />
      </Route>

      <Route path="/invite" element={<InviteAccept />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
