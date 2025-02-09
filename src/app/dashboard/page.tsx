'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StudentOverview } from '@/components/dashboard/StudentOverview';
import { UpcomingLessons } from '@/components/dashboard/UpcomingLessons';
import { StudentProgress } from '@/components/dashboard/StudentProgress';
import { useStats } from '@/hooks/useStats';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status: authStatus } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin');
    },
  });

  const { stats, isLoading, error } = useStats();

  if (authStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error('Dashboard error:', error);
  }

  return (
    <div className="space-y-8 p-8 bg-accent/10 min-h-screen">
      {/* Header Cards */}
      <DashboardHeader 
        stats={stats?.overview}
        isLoading={isLoading}
      />
      
      {/* Middle Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-1 h-full">
          <StudentOverview 
            distribution={stats?.distribution}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-1 h-full">
          <UpcomingLessons />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full">
        <StudentProgress 
          progressData={stats?.progress}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}