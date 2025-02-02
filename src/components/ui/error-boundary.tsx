'use client';

import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error);
  }, [error]);

  return (
    <Alert variant="destructive" className="my-4">
      <XCircle className="h-4 w-4" />
      <AlertTitle>Something went wrong!</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-3">
        <div>{error.message || 'An unexpected error occurred.'}</div>
        <Button onClick={reset} variant="outline" className="w-fit">
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
}
