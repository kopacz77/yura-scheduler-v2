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
    <div className="h-screen grid grid-cols-[auto,1fr] px-4">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="min-h-0 flex flex-col">
        <TopNav />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}