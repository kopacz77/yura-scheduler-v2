'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/index';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
}

export function Sidebar({ isOpen = true, onToggle, children }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'relative flex h-screen flex-col border-r bg-background transition-all duration-300',
        isOpen ? 'w-64' : 'w-16'
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-4 z-20 rounded-full bg-background shadow-md"
        onClick={onToggle}
      >
        {isOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      <ScrollArea className="flex-1 p-4">
        {children}
      </ScrollArea>
    </div>
  );
}