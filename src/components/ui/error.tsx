'use client';

import { AlertCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

// Props
interface ErrorMessageProps {
  title?: string;
  message: string;
}

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// Simple error message display
export function ErrorMessage({ title = 'Error', message }: ErrorMessageProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

// Error boundary for handling component errors
export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error);
  }, [error]);

  const errorMessage = error?.message || 'An unexpected error occurred.';

  return (
    <Alert variant="destructive" className="my-4">
      <XCircle className="h-4 w-4" />
      <AlertTitle>Something went wrong!</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-3">
        <div>{errorMessage}</div>
        <Button onClick={reset} variant="outline" className="w-fit">
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
}

// Also export ErrorMessage as default for backward compatibility
export default ErrorMessage;
