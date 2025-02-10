'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  if (session) {
    redirect(session.user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}