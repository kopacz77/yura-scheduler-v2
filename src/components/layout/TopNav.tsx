'use client';

import { UserNav } from './UserNav';
import { ThemeToggle } from './ThemeToggle';

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white h-14">
      <div className="h-full flex items-center justify-between">
        <h2 className="text-lg font-semibold px-4">Dashboard</h2>
        <div className="flex items-center gap-4 px-4">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}