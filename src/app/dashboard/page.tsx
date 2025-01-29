'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StudentOverview } from '@/components/dashboard/StudentOverview';
import { UpcomingLessons } from '@/components/dashboard/UpcomingLessons';
import { StudentProgress } from '@/components/dashboard/StudentProgress';
import { useStats } from '@/hooks/useStats';

export default function DashboardPage() {
  const { stats, isLoading } = useStats();

  return (
    <div className="flex flex-col gap-8 p-8">
      <DashboardHeader 
        stats={stats?.overview}
        isLoading={isLoading}
      />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <StudentOverview 
          distribution={stats?.distribution}
          isLoading={isLoading}
        />
        <UpcomingLessons />
      </div>

      <StudentProgress 
        progressData={stats?.progress}
        isLoading={isLoading}
      />
    </div>
  );
}
