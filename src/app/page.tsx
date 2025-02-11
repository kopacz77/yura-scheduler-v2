import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { Calendar, Medal, TrendingUp, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <header className="fixed top-0 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Logo size="small" />
            <span className="text-xl font-bold">YM Movement</span>
          </div>
          <nav className="hidden space-x-6 md:flex">
            <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              About
            </Link>
            <Link href="/programs" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Programs
            </Link>
            <Link href="/contact" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/api/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative mt-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto flex min-h-[600px] flex-col items-center justify-center space-y-12 px-4 py-16">
          <div className="relative flex flex-col items-center space-y-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Logo size="large" />
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                YM Movement
              </h1>
              <p className="mx-auto max-w-[700px] text-lg text-slate-600 md:text-xl lg:text-2xl">
                Elite ice dance coaching with Olympic athlete Yura Min
              </p>
              <p className="mx-auto max-w-[600px] text-sm text-slate-500 md:text-base">
                Transform your ice dancing journey with personalized coaching, expert guidance, and a supportive community
              </p>
            </div>

            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button size="lg" className="min-w-[200px] group" asChild>
                <Link href="/signup">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="min-w-[200px]" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            <div className="group relative flex flex-col items-center space-y-4 rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-blue-50 p-3 text-blue-600 transition-colors group-hover:bg-blue-100">
                <Medal className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold">Professional Coaching</h2>
              <p className="text-center text-sm text-slate-600">
                Learn from an Olympic athlete with years of competitive experience
              </p>
            </div>
            <div className="group relative flex flex-col items-center space-y-4 rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-green-50 p-3 text-green-600 transition-colors group-hover:bg-green-100">
                <Calendar className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold">Flexible Scheduling</h2>
              <p className="text-center text-sm text-slate-600">
                Book lessons that fit your schedule with our easy-to-use platform
              </p>
            </div>
            <div className="group relative flex flex-col items-center space-y-4 rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-purple-50 p-3 text-purple-600 transition-colors group-hover:bg-purple-100">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold">Progress Tracking</h2>
              <p className="text-center text-sm text-slate-600">
                Monitor your development with detailed progress tracking and feedback
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}