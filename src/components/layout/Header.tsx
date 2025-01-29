'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserNav } from './UserNav';

interface HeaderProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export function Header({ onSidebarToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onSidebarToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Actions area - can be expanded later */}
        <div className="flex items-center gap-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}