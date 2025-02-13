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

type RevenueData = {
  period: string;
  amount: number;
  target?: number;
};

export function AdminDashboard() {
  const { data: session, status } = useSession();
  const [studentStats, setStudentStats] = useState<StudentLevelData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([
    { period: 'Jan', amount: 12000 },
    { period: 'Feb', amount: 14000 },
    { period: 'Mar', amount: 16000 },
    { period: 'Apr', amount: 15000 },
    { period: 'May', amount: 17000 },
    { period: 'Jun', amount: 19000 },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Failed to fetch dashboard stats');
        const data = await response.json();
        
        // Format student stats
        const formattedStats = Object.values(Level).map(level => ({
          level: level.toString(),
          count: data.distribution.find((d: any) => d.level === level)?.count || 0
        }));
        setStudentStats(formattedStats);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Could not load dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span className="text-sm text-slate-600">Loading...</span>
        </div>
      </div>
    );
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
    <div className="h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard Overview</h1>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <Overview />
        </div>
        <div className="lg:col-span-3">
          <StudentStats data={studentStats} />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7 mt-4">
        <div className="lg:col-span-4">
          <LessonStats />
        </div>
        <div className="lg:col-span-3">
          <RecentAppointments />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mt-4">
        <RevenueChart data={revenueData} />
        <PaymentReport />
      </div>
    </div>
  );
}