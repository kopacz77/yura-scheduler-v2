'use client';

import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App-level error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Alert className="max-w-md">
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>
          {error?.message || 'An unexpected error occurred'}
        </AlertDescription>
        <div className="mt-4">
          <Button onClick={reset}>Try again</Button>
        </div>
      </Alert>
    </div>
  );
}
