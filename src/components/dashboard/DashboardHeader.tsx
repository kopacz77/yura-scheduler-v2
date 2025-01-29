import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Users, DollarSign, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { OverviewStats } from '@/types/stats';

interface DashboardHeaderProps {
  stats: OverviewStats | undefined;
  isLoading: boolean;
}

export function DashboardHeader({ stats, isLoading }: DashboardHeaderProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <Users className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Students</p>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <h3 className="text-2xl font-bold">{stats?.totalStudents || 0}</h3>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <CalendarDays className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">This Week's Lessons</p>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <h3 className="text-2xl font-bold">{stats?.weeklyLessons || 0}</h3>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <DollarSign className="h-8 w-8 text-yellow-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Outstanding Payments</p>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <h3 className="text-2xl font-bold">
                ${stats?.outstandingAmount.toFixed(2) || '0.00'}
              </h3>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <TrendingUp className="h-8 w-8 text-purple-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Student Progress</p>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <h3 className="text-2xl font-bold">{stats?.averageProgress || 0}%</h3>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
