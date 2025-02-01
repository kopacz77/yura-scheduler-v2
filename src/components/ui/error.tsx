import React from 'react';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface ErrorProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export function Error({ title = 'Error', message, retry }: ErrorProps) {
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <ExclamationTriangleIcon className="h-10 w-10 text-destructive" />
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        {retry && (
          <button
            onClick={retry}
            className="mt-4 text-sm font-medium text-primary hover:underline"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
