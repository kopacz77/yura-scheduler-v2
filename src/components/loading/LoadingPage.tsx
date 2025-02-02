import { LoadingSpinner } from './LoadingSpinner';

export function LoadingPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}