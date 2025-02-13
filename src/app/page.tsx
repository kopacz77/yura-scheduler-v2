import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { Medal, Calendar, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
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
      <section className="relative mt-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4 py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Logo size="large" className="mx-auto mb-8" />
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
              Elite ice dance coaching with Olympic athlete Yura Min
            </h1>
            <p className="mb-8 text-lg text-slate-600 md:text-xl">
              Transform your ice dancing journey with personalized coaching, expert guidance,
              and a supportive community
            </p>

            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto" asChild>
                <Link href="/signup">Start Your Journey</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Professional Coaching */}
            <div className="group rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="mb-6 inline-flex rounded-full bg-blue-50 p-3 text-blue-600">
                <Medal className="h-6 w-6" />
              </div>
              <h2 className="mb-4 text-xl font-semibold text-slate-900">
                Professional Coaching
              </h2>
              <p className="text-slate-600">
                Learn from an Olympic athlete with years of competitive experience
              </p>
            </div>

            {/* Flexible Scheduling */}
            <div className="group rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="mb-6 inline-flex rounded-full bg-green-50 p-3 text-green-600">
                <Calendar className="h-6 w-6" />
              </div>
              <h2 className="mb-4 text-xl font-semibold text-slate-900">
                Flexible Scheduling
              </h2>
              <p className="text-slate-600">
                Book lessons that fit your schedule with our easy-to-use platform
              </p>
            </div>

            {/* Progress Tracking */}
            <div className="group rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="mb-6 inline-flex rounded-full bg-purple-50 p-3 text-purple-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h2 className="mb-4 text-xl font-semibold text-slate-900">
                Progress Tracking
              </h2>
              <p className="text-slate-600">
                Monitor your development with detailed progress tracking and feedback
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}