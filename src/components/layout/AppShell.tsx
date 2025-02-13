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
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
      />
      
      {/* Main Content */}
      <div
        className={cn(
          'flex flex-col transition-all duration-300',
          isSidebarOpen ? 'pl-64' : 'pl-16'
        )}
      >
        <TopNav />
        <main className="flex-1 p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}