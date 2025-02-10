'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <div className="relative min-h-screen bg-background">
      <TopNav onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar
          isOpen={isDesktop || sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}