'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import {
  BarChart,
  Calendar,
  CreditCard,
  Settings,
  Users,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const adminRoutes = [
    {
      label: 'Overview',
      icon: BarChart,
      href: '/admin/dashboard',
      active: pathname === '/admin/dashboard',
    },
    {
      label: 'Schedule',
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

  const studentRoutes = [
    {
      label: 'Schedule',
      icon: Calendar,
      href: '/student/schedule',
      active: pathname === '/student/schedule',
    },
    {
      label: 'Payments',
      icon: CreditCard,
      href: '/student/payments',
      active: pathname === '/student/payments',
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/student/settings',
      active: pathname === '/student/settings',
    },
  ];

  const routes = session?.user?.role === 'ADMIN' ? adminRoutes : studentRoutes;

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      {/* Logo Header */}
      <div className="flex h-14 items-center border-b px-6">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <Logo size="small" />
          <span className="text-lg">YM Movement</span>
        </Link>
      </div>

      {/* Navigation */}
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