'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Users, Settings, BarChart2, CreditCard, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const getNavItems = (role: string) => {
  const items = [
    { title: 'Dashboard', href: '/dashboard', icon: BarChart2 },
    { title: 'Schedule', href: '/schedule', icon: Calendar },
  ];

  if (role === 'admin') {
    items.push(
      { title: 'Students', href: '/students', icon: Users },
      { title: 'Payments', href: '/payments', icon: CreditCard },
    );
  } else {
    items.push({ title: 'My Portal', href: '/student-portal', icon: UserCircle });
  }

  items.push({ title: 'Settings', href: '/settings', icon: Settings });
  
  return items;
};

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const navItems = getNavItems(user?.role || 'student');

  return (
    <div className={cn(
      'fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background',
      isOpen ? 'w-64' : 'w-[70px]',
      'transition-all duration-300 ease-in-out'
    )}>
      {/* Logo area */}
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center space-x-2">
          {isOpen ? (
            <span className="text-lg font-bold">Yura Scheduler</span>
          ) : (
            <span className="text-lg font-bold">YS</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  isOpen ? 'px-4' : 'px-2'
                )}
              >
                <item.icon className={cn('h-5 w-5', isOpen ? 'mr-3' : '')} />
                {isOpen && <span>{item.title}</span>}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}