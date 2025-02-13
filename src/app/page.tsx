import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { Medal, Calendar, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navigation Header */}
      <header className="fixed top-0 z-50 w-full border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Logo size="small" />
            <span className="text-lg font-semibold">YM Movement</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex flex-1 justify-center space-x-8">
            <Link href="/about" className="text-sm text-slate-600 hover:text-slate-900">
              About
            </Link>
            <Link href="/programs" className="text-sm text-slate-600 hover:text-slate-900">
              Programs
            </Link>
            <Link href="/contact" className="text-sm text-slate-600 hover:text-slate-900">
              Contact
            </Link>
          </div>

          {/* Sign In Button */}
          <Button className="rounded-full" variant="primary" asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="flex h-[70vh] items-center justify-center pt-16">
          <div className="text-center">
            <Logo size="large" className="mx-auto mb-8" />
            <h1 className="mx-auto max-w-[800px] text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Elite ice dance coaching with
              <br />
              Olympic athlete Yura Min
            </h1>
            <p className="mx-auto mt-6 max-w-[600px] text-lg text-slate-600">
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

        {/* Feature Cards */}
        <section className="px-4">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
            {/* Professional Coaching */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
              <div className="mb-4">
                <Medal className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Professional Coaching
              </h3>
              <p className="text-sm text-slate-600">
                Learn from an Olympic athlete with years of competitive experience
              </p>
            </div>

            {/* Flexible Scheduling */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
              <div className="mb-4">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Flexible Scheduling
              </h3>
              <p className="text-sm text-slate-600">
                Book lessons that fit your schedule with our easy-to-use platform
              </p>
            </div>

            {/* Progress Tracking */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
              <div className="mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                Progress Tracking
              </h3>
              <p className="text-sm text-slate-600">
                Monitor your development with detailed progress tracking and feedback
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}