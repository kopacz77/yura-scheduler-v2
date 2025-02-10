'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StudentOverview } from '@/components/dashboard/StudentOverview';
import { UpcomingLessons } from '@/components/dashboard/UpcomingLessons';
import { StudentProgress } from '@/components/dashboard/StudentProgress';
import { useStats } from '@/hooks/useStats';

export function AdminDashboard() {
  const { stats, isLoading, error } = useStats();

  if (error) {
    throw error;
  }

  return (
    <div className="space-y-8">
      <DashboardHeader 
        stats={stats?.overview}
        isLoading={isLoading}
      />
      
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

      <div className="w-full">
        <StudentProgress 
          progressData={stats?.progress}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}