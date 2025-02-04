'use client';

import { SignInForm } from '@/components/auth/SignInForm';
import { useAuth } from '@/contexts/auth-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push(user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard');
    }
  }, [user, router]);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to sign in to your account
          </p>
        </div>
        <SignInForm />
        <p className="text-center text-sm text-muted-foreground">
          New user?{' '}
          <a href="/auth/signup" className="underline hover:text-primary">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}