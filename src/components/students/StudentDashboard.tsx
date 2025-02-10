'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentProgress } from '@/components/dashboard/StudentProgress';
import { UpcomingLessons } from '@/components/dashboard/UpcomingLessons';
import { useStats } from '@/hooks/useStats';

export function StudentDashboard() {
  const { stats, isLoading, error } = useStats();

  if (error) {
    throw error;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-1 h-full">
          <StudentProgress 
            progressData={stats?.progress}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-1 h-full">
          <UpcomingLessons />
        </div>
      </div>
    </div>
  );
}