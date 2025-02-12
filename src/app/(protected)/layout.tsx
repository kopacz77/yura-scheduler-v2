import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AppShell } from '@/components/layout/AppShell';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    redirect(`/signin?callbackUrl=${encodeURIComponent(currentPath)}`);
  }

  // Additional role-based checks
  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const isStudentRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/student');

  if (isAdminRoute && session.user.role !== 'ADMIN') {
    redirect('/student/dashboard');
  }

  if (isStudentRoute && session.user.role !== 'STUDENT') {
    redirect('/admin/dashboard');
  }

  return (
    <AppShell>
      {children}
    </AppShell>
  );
}