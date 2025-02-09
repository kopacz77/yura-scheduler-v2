'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function StudentPortalPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin');
    },
  });

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // Redirect to appropriate area based on user role
  if (session?.user?.role === 'STUDENT') {
    redirect('/student/dashboard');
  } else {
    redirect('/admin/dashboard');
  }

  return null;
}