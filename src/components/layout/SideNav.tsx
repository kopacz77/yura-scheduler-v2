'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { Calendar, Users, CreditCard, Settings, BarChart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SideNavProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const adminRoutes = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: BarChart },
  { href: '/admin/schedule', label: 'Schedule', icon: Calendar },
  { href: '/admin/students', label: 'Students', icon: Users },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

const studentRoutes = [
  { href: '/student/dashboard', label: 'Dashboard', icon: BarChart },
  { href: '/student/schedule', label: 'My Schedule', icon: Calendar },
  { href: '/student/payments', label: 'Payments', icon: CreditCard },
  { href: '/student/settings', label: 'Settings', icon: Settings },
];

export function SideNav({ open, onOpenChange }: SideNavProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  
  const routes = user?.role === 'ADMIN' ? adminRoutes : studentRoutes;

  return (
    <nav 
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transform bg-card px-3 py-4 transition-transform duration-200 ease-in-out md:static md:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex justify-between items-center mb-4 md:hidden">
        <h2 className="font-semibold">Navigation</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange?.(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close menu</span>
        </Button>
      </div>
      <div className="space-y-1">
        {routes.map((route) => {
          const Icon = route.icon;
          return (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => onOpenChange?.(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent',
                pathname === route.href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {route.label}
            </Link>
          );
        })}
      </div>
      {open && (
        <div 
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => onOpenChange?.(false)}
        />
      )}
    </nav>
  );
}