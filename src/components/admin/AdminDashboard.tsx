'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Level } from '@prisma/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Overview } from './Overview';
import { StudentStats } from './StudentStats';
import { LessonStats } from './LessonStats';
import { RecentAppointments } from './RecentAppointments';
import { RevenueChart } from './RevenueChart';
import { PaymentReport } from './PaymentReport';
import { StudentLevelData, RevenueData } from '@/types';

export function AdminDashboard() {
  const { data: session, status } = useSession();
  const [studentStats, setStudentStats] = useState<StudentLevelData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Failed to fetch dashboard stats');
        const data = await response.json();

        // Format student stats
        const formattedStudentStats = Object.values(Level).map(level => ({
          level: level.toString(),
          count: data.distribution.find((d: any) => d.level === level)?.count || 0
        }));
        setStudentStats(formattedStudentStats);

        // Format revenue data
        const currentMonth = new Date().getMonth();
        const last6Months = Array.from({ length: 6 }, (_, i) => {
          const d = new Date();
          d.setMonth(currentMonth - i);
          return d.toLocaleString('default', { month: 'short' });
        }).reverse();

        const formattedRevenueData = last6Months.map(month => ({
          period: month,
          amount: 0, // You'll need to update this with real data
          target: 15000 // Example target
        }));
        setRevenueData(formattedRevenueData);
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
        <RevenueChart data={revenueData} />
        <PaymentReport />
      </div>
    </div>
  );
}