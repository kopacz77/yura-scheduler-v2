'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { UserNav } from '@/components/layout/UserNav';
import { MoonStar, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function TopNav() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <MoonStar className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          {user && <UserNav user={user} />}
        </div>
      </div>
    </header>
  );
}