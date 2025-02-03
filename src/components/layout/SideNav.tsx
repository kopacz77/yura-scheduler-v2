'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { Calendar, Users, CreditCard, Settings, BarChart } from 'lucide-react';

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

export function SideNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  
  const routes = user?.role === 'ADMIN' ? adminRoutes : studentRoutes;

  return (
    <nav className="w-64 min-h-screen border-r bg-card px-3 py-4">
      <div className="space-y-1">
        {routes.map((route) => {
          const Icon = route.icon;
          return (
            <Link
              key={route.href}
              href={route.href}
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
    </nav>
  );
}
