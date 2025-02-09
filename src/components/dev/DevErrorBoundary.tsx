'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { env, logger } from '@/lib/env';

interface DevErrorBoundaryProps {
  children: React.ReactNode;
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  if (!env.isDev) {
    return null;
  }

  return (
    <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-md">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Development Error</h3>
        <button
          onClick={resetErrorBoundary}
          className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
        >
          Try again
        </button>
      </div>
      <div className="bg-white p-4 rounded-md shadow-sm overflow-auto">
        <pre className="text-sm text-red-600 whitespace-pre-wrap">
          {error.message}
          {error.stack && (
            <>
              <br />
              <span className="text-gray-600 text-xs">{error.stack}</span>
            </>
          )}
        </pre>
      </div>
    </div>
  );
}

export function DevErrorBoundary({ children }: DevErrorBoundaryProps) {
  if (!env.isDev) {
    return <>{children}</>;
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        logger.error(
          'Development error caught by boundary:',
          '\nError:', error,
          '\nInfo:', info
        );
      }}
      onReset={() => {
        // Clear any error related state
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
