import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/signin');
  }

  redirect(session.user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard');
}