import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="relative flex place-items-center">
        <h1 className="text-6xl font-bold tracking-tighter sm:text-7xl">
          Schedule your lessons with
          <br /> Olympic Ice Dancer
        </h1>
      </div>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Button asChild className="text-xl" size="lg">
          <Link href="/signin">Start Scheduling</Link>
        </Button>
      </div>
    </main>
  );
}