'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Calendar,
  CreditCard,
  Settings,
  Users,
} from 'lucide-react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: 'Overview',
      icon: BarChart,
      href: '/admin/dashboard',
      active: pathname === '/admin/dashboard',
    },
    {
      label: 'Calendar',
      icon: Calendar,
      href: '/schedule',
      active: pathname === '/schedule',
    },
    {
      label: 'Students',
      icon: Users,
      href: '/students',
      active: pathname === '/students',
    },
    {
      label: 'Payments',
      icon: CreditCard,
      href: '/payments',
      active: pathname === '/payments',
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/settings',
      active: pathname === '/settings',
    },
  ];

  return (
    <div
      className={cn(
        'flex h-screen w-64 flex-col border-r bg-muted/10',
        className
      )}
    >
      <div className="flex h-14 items-center border-b px-6">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <span className="text-lg">Yura Scheduler</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={route.active ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href={route.href}>
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
}