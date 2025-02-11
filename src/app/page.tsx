import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-12 px-4 py-16">
        <div className="relative flex flex-col items-center space-y-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Logo size="large" />
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              YM Movement
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-slate-700 md:text-xl">
              Elite ice dance coaching with Olympic athlete Yura Min
            </p>
          </div>

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button asChild size="lg" className="min-w-[200px]">
              <Link href="/signin">
                Sign In
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 text-center shadow-sm">
            <h2 className="text-xl font-semibold">Professional Coaching</h2>
            <p className="text-sm text-slate-600">Expert guidance from an Olympic athlete</p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 text-center shadow-sm">
            <h2 className="text-xl font-semibold">Flexible Scheduling</h2>
            <p className="text-sm text-slate-600">Book lessons that fit your schedule</p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border bg-white p-6 text-center shadow-sm">
            <h2 className="text-xl font-semibold">Progress Tracking</h2>
            <p className="text-sm text-slate-600">Monitor your development journey</p>
          </div>
        </div>
      </div>
    </div>
  );
}
