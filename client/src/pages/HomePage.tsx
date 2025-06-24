import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
          WalletLink
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Manage your family finances with ease. Track expenses, income, and
          collaborate with family members seamlessly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      <section className="grid md:grid-cols-3 gap-8">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-2xl">💳</span>
          </div>
          <h3 className="text-xl font-semibold">Account Management</h3>
          <p className="text-muted-foreground">
            Track multiple accounts and manage your finances across different
            banks and services.
          </p>
        </div>

        <div className="text-center space-y-4">
          <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-2xl">👨‍👩‍👧‍👦</span>
          </div>
          <h3 className="text-xl font-semibold">Family Collaboration</h3>
          <p className="text-muted-foreground">
            Share expenses and budgets with family members. Everyone stays in
            sync.
          </p>
        </div>

        <div className="text-center space-y-4">
          <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
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
