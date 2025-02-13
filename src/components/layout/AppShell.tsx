'use client';

import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { SiteFooter } from './site-footer';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
      />
      
      <div
        className={cn(
          'flex flex-1 flex-col',
          isSidebarOpen ? 'pl-64' : 'pl-16'
        )}
      >
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}