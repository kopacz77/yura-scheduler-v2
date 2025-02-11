'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
      />
      <main className={cn(
        'flex-1 transition-all duration-300',
        isSidebarOpen ? 'ml-64' : 'ml-16'
      )}>
        {children}
      </main>
    </div>
  );
}