import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth';
import { AppShell } from '@/components/layout/AppShell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect('/signin');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/student/dashboard');
  }

  return <AppShell>{children}</AppShell>;
}