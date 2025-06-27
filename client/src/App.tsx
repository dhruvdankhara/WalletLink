import { Routes, Route } from 'react-router-dom';
import { PublicLayout, DashboardLayout, PrivateRoute } from '@/components';
import {
  AccountOverviewPage,
  AccountPage,
  CategoryPage,
  DashboardPage,
  ForgotPassword,
  HomePage,
  InviteAccept,
  LoginPage,
  MembersOverviewPage,
  MembersPage,
  NotFoundPage,
  RegisterPage,
  ResetPassword,
  TransactionDetailedPage,
  TransactionPage,
} from '@/pages';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
      </Route>

      <Route
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/transactions" element={<TransactionPage />} />
        <Route path="/transactions/:id" element={<TransactionDetailedPage />} />

        <Route path="/members" element={<MembersPage />} />
        <Route path="/members/:id" element={<MembersOverviewPage />} />

        <Route path="/account" element={<AccountPage />} />
        <Route path="/account/:id" element={<AccountOverviewPage />} />

        <Route path="/category" element={<CategoryPage />} />
      </Route>

      <Route path="/invite" element={<InviteAccept />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
