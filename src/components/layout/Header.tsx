import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Bell, User } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

interface HeaderProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export function Header({ sidebarOpen, onSidebarToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <Avatar className="h-8 w-8">
            <User className="h-4 w-4" />
          </Avatar>
        </div>
      </div>
    </header>
  );
}