'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SideNav } from '@/components/layout/SideNav';
import { TopNav } from '@/components/layout/TopNav';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, user } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const isPublicPage = pathname === '/' || pathname?.startsWith('/auth');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Don't show navigation on public pages
  if (isPublicPage) {
    return <>{children}</>;
  }

  // If not authenticated, don't show navigation
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav onMenuClick={() => setIsSideNavOpen(true)} />
      <div className="flex">
        <SideNav 
          open={isSideNavOpen}
          onOpenChange={setIsSideNavOpen}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}