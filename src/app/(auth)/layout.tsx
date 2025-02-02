'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LoadingPage } from '@/components/loading/LoadingPage';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (session) {
      // Redirect based on role
      switch (session.user.role) {
        case 'ADMIN':
          router.push('/admin/dashboard');
          break;
        case 'STUDENT':
          router.push('/student/dashboard');
          break;
        default:
          router.push('/');
      }
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <LoadingPage />;
  }

  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}