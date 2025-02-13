'use client';

import { UserNav } from './UserNav';
import { ThemeToggle } from './ThemeToggle';

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="flex h-14 items-center justify-between pr-6">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold px-4">Dashboard</h2>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}