'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentProgress } from '@/components/dashboard/StudentProgress';
import { UpcomingLessons } from '@/components/dashboard/UpcomingLessons';
import { useStats } from '@/hooks/useStats';
import { ProgressDataPoint } from '@/types/schedule';

export function AdminDashboard() {
  const { stats, isLoading, error } = useStats();

  if (error) {
    throw error;
  }

  const mappedProgress: ProgressDataPoint[] = stats?.progress?.map(p => ({
    name: p.name,
    current: p.value,
    total: p.total
  })) || [];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-1 h-full">
          <StudentProgress 
            progressData={mappedProgress}
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