import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { Medal, Calendar, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Navigation Header */}
      <header className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <Logo size="small" />
            <span className="text-xl font-bold">YM Movement</span>
          </Link>

          <nav className="hidden space-x-6 md:flex">
            <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              About
            </Link>
            <Link href="/programs" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Programs
            </Link>
            <Link href="/contact" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="container mx-auto px-4 text-center">
          <Logo size="large" className="mx-auto mb-8" />
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Elite ice dance coaching with Olympic athlete Yura Min
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Transform your ice dancing journey with personalized coaching, expert guidance,
            and a supportive community
          </p>

          <div className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto" asChild>
              <Link href="/signup">Start Your Journey →</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Card 1: Professional Coaching */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-md ring-1 ring-slate-200 transition-all hover:shadow-lg">
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Medal className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900">
                  Professional Coaching
                </h3>
                <p className="text-slate-600">
                  Learn from an Olympic athlete with years of competitive experience
                </p>
              </div>
              <div className="absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-blue-50 transition-all group-hover:bg-blue-100" />
            </div>

            {/* Card 2: Flexible Scheduling */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-md ring-1 ring-slate-200 transition-all hover:shadow-lg">
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900">
                  Flexible Scheduling
                </h3>
                <p className="text-slate-600">
                  Book lessons that fit your schedule with our easy-to-use platform
                </p>
              </div>
              <div className="absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-green-50 transition-all group-hover:bg-green-100" />
            </div>

            {/* Card 3: Progress Tracking */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-md ring-1 ring-slate-200 transition-all hover:shadow-lg">
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900">
                  Progress Tracking
                </h3>
                <p className="text-slate-600">
                  Monitor your development with detailed progress tracking and feedback
                </p>
              </div>
              <div className="absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-purple-50 transition-all group-hover:bg-purple-100" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}