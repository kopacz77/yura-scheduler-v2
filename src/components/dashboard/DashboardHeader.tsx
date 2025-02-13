import { DashboardStats } from '@/types/stats';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';

interface DashboardHeaderProps {
  stats?: DashboardStats;
  isLoading?: boolean;
  error?: string;
}

export function DashboardHeader({ stats, isLoading, error }: DashboardHeaderProps) {
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (retrying) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [retrying]);

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription className="flex items-center justify-between">
          <span>Unable to load data: {error}</span>
          {!retrying && (
            <button 
              onClick={() => setRetrying(true)}
              className="text-sm underline hover:no-underline"
            >
              Retry
            </button>
          )}
          {retrying && <span className="text-sm">Retrying...</span>}
        </AlertDescription>
      </Alert>
    );
  }

  const StatCard = ({ 
    title, 
    value, 
    trend, 
    change, 
    format = (v: number) => v.toString() 
  }: { 
    title: string;
    value: number;
    trend?: 'up' | 'down';
    change?: number;
    format?: (value: number) => string;
  }) => (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow">
      <div className="px-6 py-5">
        <div className="flex flex-row items-center justify-between pb-2">
          <div className="text-sm font-medium text-muted-foreground">{title}</div>
        </div>
        <div className="flex flex-col space-y-1">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </>
          ) : (
            <>
              <h3 className="text-2xl font-bold tracking-tight">{format(value)}</h3>
              {(trend && change !== undefined) && (
                <div className="flex items-center space-x-1">
                  <span className={`${trend === 'up' ? 'text-green-500' : 'text-red-500'} font-medium`}>
                    {trend === 'up' ? '+' : '-'}{Math.abs(change).toFixed(1)}%
                  </span>
                  <span className="text-sm text-muted-foreground">from last month</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="pr-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={stats?.overview.totalStudents.value || 0}
          trend={stats?.overview.totalStudents.trend}
          change={stats?.overview.totalStudents.change}
        />
        
        <StatCard
          title="Active Students"
          value={stats?.overview.activeStudents.value || 0}
          trend={stats?.overview.activeStudents.trend}
          change={stats?.overview.activeStudents.change}
        />
        
        <StatCard
          title="Revenue"
          value={stats?.overview.revenue.value || 0}
          trend={stats?.overview.revenue.trend}
          change={stats?.overview.revenue.change}
          format={(value) => `$${(value / 100).toFixed(2)}`}
        />
        
        <StatCard
          title="Completed Lessons"
          value={stats?.overview.completedLessons.value || 0}
          trend={stats?.overview.completedLessons.trend}
          change={stats?.overview.completedLessons.change}
        />
      </div>
    </div>
  );
}