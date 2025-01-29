'use client';

import { useState, Suspense } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface MainLayoutProps {
  children: React.ReactNode;
}

function LoadingFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="relative flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <ErrorBoundary>
        <Sidebar 
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </ErrorBoundary>
      
      {/* Main content area */}
      <div className={cn(
        "flex flex-1 flex-col",
        "transition-all duration-300 ease-in-out",
        sidebarOpen ? "lg:pl-64" : "lg:pl-20"
      )}>
        {/* Header */}
        <ErrorBoundary>
          <Header 
            sidebarOpen={sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        </ErrorBoundary>
        
        {/* Main content */}
        <main className="relative flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto p-4">
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback />}>
                {children}
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
