'use client';

import { useSession } from 'next-auth/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Overview } from './Overview';
import { LessonStats } from './LessonStats';
import { RecentAppointments } from './RecentAppointments';
import { StudentStats } from './StudentStats';
import { PaymentReport } from './PaymentReport';
import { RevenueChart } from './RevenueChart';
import { useEffect, useState } from 'react';
import { Level } from '@prisma/client';

type StudentLevelData = {
  level: string;
  count: number;
};

export function AdminDashboard() {
  const { data: session, status } = useSession();
  const [studentStats, setStudentStats] = useState<StudentLevelData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/student-stats');
        if (!response.ok) throw new Error('Failed to fetch student stats');
        const data = await response.json();
        
        // Transform the data into the format expected by StudentStats
        const formattedStats = Object.values(Level).map(level => ({
          level: level.toString(),
          count: data.levels[level] || 0
        }));
        
        setStudentStats(formattedStats);
      } catch (err) {
        console.error('Error fetching student stats:', err);
        setError('Could not load student statistics');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (status === 'loading' || isLoading) {
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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
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
        <StudentStats data={studentStats} />
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