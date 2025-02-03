'use client';

import { useAuth } from '@/contexts/auth-context';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <div className="min-h-screen">{children}</div>;
}
