'use client';

import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

// Props
interface ErrorProps {
  title?: string;
  message: string;
  retry?: () => void;
}

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  message?: string;
}

// Basic error message
export function ErrorMessage({ title = 'Error', message, retry }: ErrorProps) {
  return (
    <Alert variant="destructive">
      <XCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <div>{message}</div>
        {retry && (
          <Button onClick={retry} variant="outline" className="mt-3 w-fit">
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

// Error boundary with retry
export function ErrorBoundary({ error, reset, title = 'Something went wrong!', message }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  const errorMessage = message || error?.message || 'An unexpected error occurred.';

  return (
    <div className="flex min-h-[200px] items-center justify-center p-4">
      <ErrorMessage
        title={title}
        message={errorMessage}
        retry={reset}
      />
    </div>
  );
}

// Full page error
export function ErrorPage({ error, reset, title = 'Something went wrong!', message }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error('App-level error:', error);
  }, [error]);

  const errorMessage = message || error?.message || 'An unexpected error occurred.';

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Alert className="max-w-md">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          {errorMessage}
          <div className="mt-4">
            <Button onClick={reset}>Try again</Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

// For backward compatibility
export const Error = ErrorPage;