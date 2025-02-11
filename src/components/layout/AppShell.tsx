'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LoadingPage } from '@/components/ui/loading';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  if (status === 'loading') {
    return <LoadingPage />;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
        user={session.user}
      />
      <main 
        className={cn(
          'flex-1 transition-all duration-300 p-8',
          isSidebarOpen ? 'ml-64' : 'ml-16'
        )}
      >
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}