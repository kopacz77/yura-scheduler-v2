'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  CreditCard,
  Building2,
  BarChart,
  Clock,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const navItems: NavItem[] = [
  // Admin Routes
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN'],
  },
  {
    title: 'Schedule',
    href: '/admin/schedule',
    icon: Calendar,
    roles: ['ADMIN'],
  },
  {
    title: 'Students',
    href: '/admin/students',
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    title: 'Payments',
    href: '/admin/payments',
    icon: CreditCard,
    roles: ['ADMIN'],
  },
  {
    title: 'Rinks',
    href: '/admin/rinks',
    icon: Building2,
    roles: ['ADMIN'],
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart,
    roles: ['ADMIN'],
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    roles: ['ADMIN'],
  },

  // Student Routes
  {
    title: 'Dashboard',
    href: '/student/dashboard',
    icon: LayoutDashboard,
    roles: ['STUDENT'],
  },
  {
    title: 'Schedule',
    href: '/student/schedule',
    icon: Calendar,
    roles: ['STUDENT'],
  },
  {
    title: 'My Lessons',
    href: '/student/lessons',
    icon: Clock,
    roles: ['STUDENT'],
  },
  {
    title: 'Payments',
    href: '/student/payments',
    icon: CreditCard,
    roles: ['STUDENT'],
  },
  {
    title: 'Settings',
    href: '/student/settings',
    icon: Settings,
    roles: ['STUDENT'],
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'STUDENT';

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (!isOpen) return;
    onClose();
  }, [pathname, isOpen, onClose]);

  const filteredNavItems = navItems.filter(
    (item) => item.roles?.includes(userRole)
  );

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 transform bg-background transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
        {
          'translate-x-0': isOpen,
          '-translate-x-full': !isOpen,
        }
      )}
    >
      <div className="flex h-full flex-col border-r">
        <div className="flex h-14 items-center justify-between px-4 lg:h-[4rem]">
          <span className="text-lg font-semibold">Yura Scheduler</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1 px-2 py-2">
          <nav className="space-y-1">
            {filteredNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                    pathname === item.href
                      ? 'bg-accent text-accent-foreground'
                      : 'transparent'
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </span>
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </aside>
  );
}