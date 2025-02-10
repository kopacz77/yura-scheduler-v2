'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Props
interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullscreen?: boolean;
}

interface LoadingSkeletonProps {
  type: 'dashboard' | 'chart' | 'list';
}

// Base loading spinner
export function Loading({ size = 'md', className, fullscreen = false }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const containerClasses = cn(
    'flex items-center justify-center',
    fullscreen && 'h-[450px] shrink-0',
    className
  );

  return (
    <div className={containerClasses}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
    </div>
  );
}

// Skeleton states for different UI patterns
export function LoadingSkeleton({ type }: LoadingSkeletonProps) {
  switch (type) {
    case 'dashboard':
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border bg-card p-4">
              <Skeleton className="h-8 w-1/2 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            </div>
          ))}
        </div>
      );

    case 'chart':
      return (
        <div className="rounded-lg border bg-card p-4 w-full">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      );

    case 'list':
      return (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-4 rounded-lg border bg-card p-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      );
  }
}
