'use client';

import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
      />
      
      {/* Main Content */}
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300',
          isSidebarOpen ? 'pl-64' : 'pl-16'
        )}
      >
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}