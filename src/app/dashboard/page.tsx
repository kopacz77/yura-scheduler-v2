'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin');
    },
  });

  // Redirect based on role
  if (session?.user?.role === 'ADMIN') {
    redirect('/admin/dashboard');
  } else if (session?.user?.role === 'STUDENT') {
    redirect('/student/dashboard');
  }

  return null;
}