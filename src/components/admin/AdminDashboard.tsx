'use client';

import { useSession } from 'next-auth/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Overview } from './Overview';
import { LessonStats } from './LessonStats';
import { RecentAppointments } from './RecentAppointments';
import { StudentStats } from './StudentStats';
import { PaymentReport } from './PaymentReport';
import { RevenueChart } from './RevenueChart';

export function AdminDashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!session?.user || session.user.role !== 'ADMIN') {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          You do not have permission to view this page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {session.user.name}</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Overview />
        <StudentStats />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <LessonStats className="md:col-span-2 lg:col-span-4" />
        <RecentAppointments className="md:col-span-2 lg:col-span-3" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart />
        <PaymentReport />
      </div>
    </div>
  );
}