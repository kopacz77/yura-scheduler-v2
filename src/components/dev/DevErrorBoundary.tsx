'use client';

import { ErrorBoundary } from 'react-error-boundary';

interface DevErrorBoundaryProps {
  children: React.ReactNode;
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-md">
      <h3 className="text-lg font-semibold text-red-800 mb-2">Development Error</h3>
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
  if (process.env.NODE_ENV === 'development') {
    return (
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error) => {
          console.error('Development error caught by boundary:', error);
        }}
      >
        {children}
      </ErrorBoundary>
    );
  }

  return <>{children}</>;
}
