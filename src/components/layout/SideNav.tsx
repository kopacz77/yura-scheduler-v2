'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/index';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface SideNavProps {
  items: {
    title: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function SideNav({ items, isCollapsed, onToggle }: SideNavProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'relative flex h-screen flex-col border-r bg-background',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-4 z-20 rounded-full bg-background shadow-md"
        onClick={onToggle}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <ScrollArea className="flex-1 p-4">
        <nav className="grid gap-2">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link key={index} href={item.href}>
                <span
                  className={cn(
                    'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                    pathname === item.href ? 'bg-accent' : 'transparent',
                    isCollapsed ? 'justify-center' : 'justify-start'
                  )}
                >
                  {Icon && (
                    <Icon className={cn('h-4 w-4', isCollapsed ? '' : 'mr-2')} />
                  )}
                  {!isCollapsed && <span>{item.title}</span>}
                </span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}