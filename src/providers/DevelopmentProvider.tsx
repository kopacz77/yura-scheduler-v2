'use client';

import { env } from '@/lib/env';
import { DevErrorBoundary } from '@/components/dev/DevErrorBoundary';
import { ReactNode } from 'react';

interface DevelopmentProviderProps {
  children: ReactNode;
}

export function DevelopmentProvider({ children }: DevelopmentProviderProps) {
  if (!env.isDev) {
    return <>{children}</>;
  }

  return (
    <>
      <DevErrorBoundary>{children}</DevErrorBoundary>
      {env.debug && (
        <div className="fixed bottom-4 right-4 p-2 bg-yellow-100 text-yellow-800 text-xs rounded shadow-lg">
          Debug Mode
        </div>
      )}
    </>
  );
}
