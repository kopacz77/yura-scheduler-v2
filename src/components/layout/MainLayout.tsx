'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SideNav } from '@/components/layout/SideNav';
import { TopNav } from '@/components/layout/TopNav';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, user } = useAuth();
  const pathname = usePathname();
  const isPublicPage = pathname === '/' || pathname.startsWith('/auth');

  if (isLoading) {
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
      <TopNav />
      <div className="flex">
        <SideNav />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}