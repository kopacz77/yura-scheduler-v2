'use client';

import ErrorMessage from '@/components/ui/error';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-4">
      <ErrorMessage
        title="Error Loading Analytics"
        message={error.message}
      />
    </div>
  );
}
