import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold">Yura Ice Dance</h1>
            <div className="flex items-center gap-4">
              <Button asChild variant="outline">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Professional Ice Dance Training
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Join world-class ice dance coach Yura Min for personalized lessons
              and expert guidance in your skating journey.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/auth/signup">Start Training</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
