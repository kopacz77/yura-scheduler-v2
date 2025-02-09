'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function StudentPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin');
    },
  });

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // Redirect to appropriate dashboard based on user role
  if (session?.user?.role === 'ADMIN') {
    redirect('/admin/dashboard');
  } else {
    redirect('/student/dashboard');
  }

  return null;
}