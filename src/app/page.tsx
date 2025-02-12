import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-5xl px-6 text-center">
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          Yura Scheduler
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Schedule and manage ice skating lessons with ease.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/signin">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}