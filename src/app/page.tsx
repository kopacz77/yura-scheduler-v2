import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { Medal, Calendar, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Navigation Header */}
      <header className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center px-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Logo size="small" />
            <span className="text-xl font-bold">YM Movement</span>
          </div>
          
          {/* Centered Navigation */}
          <nav className="mx-auto hidden md:block">
            <div className="flex items-center justify-center space-x-8">
              <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                About
              </Link>
              <Link href="/programs" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Programs
              </Link>
              <Link href="/contact" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Contact
              </Link>
            </div>
          </nav>
          
          {/* Sign In Button */}
          <Button className="ml-auto bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex min-h-[500px] items-center justify-center pt-16 pb-8">
        <div className="container mx-auto px-4 text-center">
          <Logo size="large" className="mx-auto mb-6" />
          <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Elite ice dance coaching with Olympic athlete Yura Min
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
            Transform your ice dancing journey with personalized coaching, expert guidance,
            and a supportive community
          </p>

          <div className="mt-8 flex flex-col items-center justify-center space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button 
              size="lg" 
              className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto" 
              asChild
            >
              <Link href="/signup">
                Start Your Journey
                <span className="ml-2 opacity-70">→</span>
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto"
              asChild
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1: Professional Coaching */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200 transition-all hover:shadow-lg">
              <div className="relative z-10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Medal className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  Professional Coaching
                </h3>
                <p className="text-sm text-slate-600">
                  Learn from an Olympic athlete with years of competitive experience
                </p>
              </div>
              <div className="absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-blue-50 transition-all group-hover:bg-blue-100" />
            </div>

            {/* Card 2: Flexible Scheduling */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200 transition-all hover:shadow-lg">
              <div className="relative z-10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  Flexible Scheduling
                </h3>
                <p className="text-sm text-slate-600">
                  Book lessons that fit your schedule with our easy-to-use platform
                </p>
              </div>
              <div className="absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-green-50 transition-all group-hover:bg-green-100" />
            </div>

            {/* Card 3: Progress Tracking */}
            <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200 transition-all hover:shadow-lg">
              <div className="relative z-10">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  Progress Tracking
                </h3>
                <p className="text-sm text-slate-600">
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