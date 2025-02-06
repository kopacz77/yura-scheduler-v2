import React from 'react';
import { OverviewCards } from '@/components/admin/analytics/OverviewCards';
import { RevenueChart } from '@/components/admin/analytics/RevenueChart';
import { StudentActivityChart } from '@/components/admin/analytics/StudentActivityChart';
import { TopStudentsCard } from '@/components/admin/analytics/TopStudentsCard';
import { getAnalyticsData } from '@/lib/actions/analytics';
import { Heading } from '@/components/ui/heading';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const { stats, revenueData, activityData, topStudents } = await getAnalyticsData();

  return (
    <div className="space-y-8 p-8">
      <Heading
        title="Dashboard"
        description="Business analytics and insights"
      />

      <OverviewCards stats={stats} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RevenueChart data={revenueData} />
        <StudentActivityChart data={activityData} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TopStudentsCard students={topStudents} />
      </div>
    </div>
  );
}