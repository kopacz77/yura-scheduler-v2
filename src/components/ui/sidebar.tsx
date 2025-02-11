'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
}

export function Sidebar({ isOpen = true, onToggle, children }: SidebarProps) {
  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300',
        isOpen ? 'w-64' : 'w-16'
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-4 z-50 rounded-full bg-background shadow-md"
        onClick={onToggle}
      >
        {isOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      <ScrollArea className="h-full px-4 py-8">
        <nav className="flex flex-col space-y-1">
          {children}
        </nav>
      </ScrollArea>
    </div>
  );
}