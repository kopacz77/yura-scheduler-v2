'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="relative flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Main content area */}
      <div className={cn(
        "flex flex-1 flex-col",
        "transition-all duration-300 ease-in-out",
        sidebarOpen ? "lg:pl-64" : "lg:pl-20"
      )}>
        {/* Header */}
        <Header 
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        
        {/* Main content */}
        <main className="relative flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}