'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Home,
  Users,
  Calendar,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  ScrollText,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Resources', href: '/resources', icon: ScrollText },
];

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const NavItem = ({ item }: { item: typeof navigation[0] }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-x-3 rounded-lg px-3 py-2 text-sm font-medium',
          'transition-all duration-150 ease-in-out',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-primary'
        )}
      >
        <Icon className="h-5 w-5" />
        {isOpen && <span>{item.name}</span>}
      </Link>
    );
  };

  return (
    <div
      className={cn(
        'fixed inset-y-0 z-50 flex flex-col bg-card',
        'transition-all duration-300 ease-in-out',
        isOpen ? 'w-64' : 'w-20',
        'border-r'
      )}
    >
      {/* Logo area */}
      <div className="flex h-16 items-center justify-between gap-x-4 border-b px-4">
        <div className="flex items-center gap-x-3">
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-8 w-8"
          />
          {isOpen && <span className="text-lg font-semibold">Yura Scheduler</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="lg:block"
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>

      {/* Bottom navigation */}
      <div className="border-t px-3 py-4">
        {bottomNavigation.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </div>
    </div>
  );
}