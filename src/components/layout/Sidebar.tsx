'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/ui/logo';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Calendar,
  Users,
  CreditCard,
  Settings,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  user: any; // We'll type this properly later
}

export function Sidebar({ isOpen = true, onToggle, user }: SidebarProps) {
  const pathname = usePathname();

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/schedule', label: 'Schedule', icon: Calendar },
    { href: '/admin/students', label: 'Students', icon: Users },
    { href: '/admin/payments', label: 'Payments', icon: CreditCard },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const studentLinks = [
    { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/student/schedule', label: 'My Schedule', icon: Calendar },
    { href: '/student/payments', label: 'My Payments', icon: CreditCard },
    { href: '/student/settings', label: 'Settings', icon: Settings },
  ];

  const links = user.role === 'ADMIN' ? adminLinks : studentLinks;

  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-white transition-all duration-300',
        isOpen ? 'w-64' : 'w-16'
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-4 z-50 rounded-full bg-white shadow-md"
        onClick={onToggle}
      >
        {isOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      <div className="flex h-16 items-center justify-center border-b px-4">
        {isOpen ? (
          <div className="flex items-center space-x-2">
            <Logo size="small" />
            <span className="text-lg font-semibold">YM Movement</span>
          </div>
        ) : (
          <Logo size="small" />
        )}
      </div>

      <ScrollArea className="flex h-[calc(100vh-4rem)] flex-col justify-between px-4 py-8">
        <nav className="flex flex-col space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Button
                key={link.href}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'justify-start',
                  !isOpen && 'justify-center px-2'
                )}
                asChild
              >
                <Link href={link.href}>
                  <Icon className="mr-2 h-4 w-4" />
                  {isOpen && link.label}
                </Link>
              </Button>
            );
          })}
        </nav>

        <div className="mt-auto border-t pt-4">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-600',
              !isOpen && 'justify-center px-2'
            )}
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isOpen && 'Sign Out'}
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
