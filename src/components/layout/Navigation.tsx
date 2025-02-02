'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Calendar,
  User,
  Settings,
  Users,
  Building2,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ['ADMIN', 'COACH'],
  },
  {
    title: 'Schedule',
    href: '/schedule',
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: 'My Portal',
    href: '/student-portal',
    icon: <User className="h-5 w-5" />,
    roles: ['STUDENT'],
  },
  {
    title: 'Students',
    href: '/students',
    icon: <Users className="h-5 w-5" />,
    roles: ['ADMIN', 'COACH'],
  },
  {
    title: 'Rinks',
    href: '/admin/rinks',
    icon: <Building2 className="h-5 w-5" />,
    roles: ['ADMIN'],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'STUDENT';

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  return (
    <nav className="space-y-1">
      {filteredNavItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-2"
            >
              {item.icon}
              {item.title}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
