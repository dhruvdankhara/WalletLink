import { Link } from 'react-router-dom';
import { Button } from '@/components';

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="space-y-6 py-12 text-center">
        <h1 className="from-primary via-primary to-primary/80 bg-gradient-to-r bg-clip-text text-5xl font-bold text-transparent">
          WalletLink
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          Manage your family finances with ease. Track expenses, income, and
          collaborate with family members seamlessly.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started Free
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid gap-8 md:grid-cols-3">
        <div className="space-y-4 text-center">
          <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-lg">
            <span className="text-2xl">💳</span>
          </div>
          <h3 className="text-xl font-semibold">Account Management</h3>
          <p className="text-muted-foreground">
            Track multiple accounts and manage your finances across different
            banks and services.
          </p>
        </div>

        <div className="space-y-4 text-center">
          <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-lg">
            <span className="text-2xl">👨‍👩‍👧‍👦</span>
          </div>
          <h3 className="text-xl font-semibold">Family Collaboration</h3>
          <p className="text-muted-foreground">
            Share expenses and budgets with family members. Everyone stays in
            sync.
          </p>
        </div>

        <div className="space-y-4 text-center">
          <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-lg">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-xl font-semibold">Smart Analytics</h3>
          <p className="text-muted-foreground">
            Get insights into your spending patterns and make informed financial
            decisions.
          </p>
        </div>
      </section>
    </div>
  );
}
