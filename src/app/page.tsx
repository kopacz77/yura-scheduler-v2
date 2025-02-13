import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { Medal, Calendar, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="fixed top-0 z-50 w-full border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2">
            <Logo size="small" />
            <span className="text-lg font-semibold">YM Movement</span>
          </Link>

          {/* Center Nav */}
          <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <ul className="flex space-x-8">
              <li>
                <Link href="/about" className="text-sm text-slate-600 hover:text-slate-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-sm text-slate-600 hover:text-slate-900">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-600 hover:text-slate-900">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <Button className="rounded-full" variant="primary" asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex min-h-screen items-center justify-center pt-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Logo size="large" className="mx-auto mb-8" />
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Elite ice dance coaching with
            <br />
            Olympic athlete Yura Min
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Transform your ice dancing journey with personalized coaching, expert guidance,
            and a supportive community
          </p>

          <div className="mt-10 flex justify-center space-x-4">
            <Button 
              size="lg" 
              className="rounded-full bg-blue-600 hover:bg-blue-700" 
              asChild
            >
              <Link href="/signup">Start Your Journey →</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full"
              asChild
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="-mt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Professional Coaching */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Medal className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Professional Coaching
              </h3>
              <p className="text-sm text-slate-600">
                Learn from an Olympic athlete with years of competitive experience
              </p>
            </div>

            {/* Flexible Scheduling */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Flexible Scheduling
              </h3>
              <p className="text-sm text-slate-600">
                Book lessons that fit your schedule with our easy-to-use platform
              </p>
            </div>

            {/* Progress Tracking */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Progress Tracking
              </h3>
              <p className="text-sm text-slate-600">
                Monitor your development with detailed progress tracking and feedback
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}