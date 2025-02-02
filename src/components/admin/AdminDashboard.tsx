'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ScheduleOverview } from '@/components/schedule/ScheduleOverview';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { StudentStats } from '@/components/admin/StudentStats';
import { LessonStats } from '@/components/admin/LessonStats';
import { RetentionChart } from '@/components/admin/RetentionChart';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CalendarDays, DollarSign, Users, BarChart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function AdminDashboard() {
  const { 
    isLoading, 
    revenue, 
    lessonStats, 
    studentStats, 
    fetchAnalytics,
    getStudentRetention 
  } = useAnalytics();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenue?.total || 0)}</div>
            {revenue?.byPeriod?.[0] && (
              <p className="text-xs text-muted-foreground">
                {revenue.byPeriod[0].amount > 0 ? '+' : ''}
                {formatCurrency(revenue.byPeriod[0].amount)} from last month
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentStats?.activeCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              {studentStats?.newCount || 0} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Lessons</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lessonStats?.upcomingCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              {lessonStats?.completed || 0} completed this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue breakdown</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <RevenueChart data={revenue?.byPeriod || []} />
        </CardContent>
      </Card>

      {/* Schedule and Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Schedule Overview</CardTitle>
            <CardDescription>Today's lessons and availability</CardDescription>
          </CardHeader>
          <CardContent>
            <ScheduleOverview />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Student Stats</CardTitle>
            <CardDescription>Student levels and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <StudentStats data={studentStats?.byLevel || []} />
          </CardContent>
        </Card>
      </div>

      {/* Lesson Stats and Retention */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Lesson Statistics</CardTitle>
            <CardDescription>Completion and cancellation rates</CardDescription>
          </CardHeader>
          <CardContent>
            <LessonStats data={lessonStats || null} />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Student Retention</CardTitle>
              <CardDescription>Monthly retention rates by cohort</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => getStudentRetention()}>
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <RetentionChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}