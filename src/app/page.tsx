import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Yura Min Ice Dance
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Olympic ice dancer coaching the next generation
        </p>
      </div>

      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Button asChild size="lg" className="text-lg px-8 py-3">
          <Link href="/signin">Start Scheduling</Link>
        </Button>
      </div>
    </div>
  );
}