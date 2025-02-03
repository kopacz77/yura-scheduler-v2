'use client';

import { useAuth } from '@/contexts/auth-context';
import { UserNav } from '@/components/layout/UserNav';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export function TopNav() {
  const { user } = useAuth();

  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Yura Scheduler</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user && <UserNav user={user} />}
        </div>
      </div>
    </header>
  );
}
