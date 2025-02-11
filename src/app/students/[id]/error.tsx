'use client';

import { ErrorBoundary } from '@/components/ui/error';

export default function StudentErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorBoundary
      error={error}
      reset={reset}
      title="Failed to load student profile"
      message="There was an error loading the student profile. Please try again."
    />
  );
}