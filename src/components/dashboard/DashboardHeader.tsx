import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Users, DollarSign, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { DashboardStats } from '@/types/stats';

interface DashboardHeaderProps {
  stats: DashboardStats['overview'] | undefined;
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
              <div>
                <h3 className="text-2xl font-bold">{stats?.totalStudents.value || 0}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <span className={stats?.totalStudents.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                    {stats?.totalStudents.trend === 'up' ? '+' : '-'}{stats?.totalStudents.change || 0}
                  </span>
                  from last month
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <CalendarDays className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Students</p>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div>
                <h3 className="text-2xl font-bold">{stats?.activeStudents.value || 0}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <span className={stats?.activeStudents.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                    {stats?.activeStudents.trend === 'up' ? '+' : '-'}{stats?.activeStudents.change || 0}
                  </span>
                  from last month
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <DollarSign className="h-8 w-8 text-yellow-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Revenue</p>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div>
                <h3 className="text-2xl font-bold">
                  ${((stats?.revenue.value || 0) / 100).toFixed(2)}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <span className={stats?.revenue.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                    {stats?.revenue.trend === 'up' ? '+' : '-'}${((stats?.revenue.change || 0) / 100).toFixed(2)}
                  </span>
                  from last month
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <TrendingUp className="h-8 w-8 text-purple-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Completed Lessons</p>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div>
                <h3 className="text-2xl font-bold">{stats?.completedLessons.value || 0}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <span className={stats?.completedLessons.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                    {stats?.completedLessons.trend === 'up' ? '+' : '-'}{stats?.completedLessons.change || 0}
                  </span>
                  from last month
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}