'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { LoadingSpinner } from './LoadingSpinner';

export function RouteChangeLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Show loading state
    setIsLoading(true);

    // Hide loading state after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <LoadingSpinner size="lg" />
    </div>
  );
}