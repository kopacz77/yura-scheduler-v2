import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AppShell } from '@/components/layout/AppShell';

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/signin');
  }

  if (session.user.role !== 'STUDENT') {
    redirect('/admin/dashboard');
  }

  return <AppShell>{children}</AppShell>;
}