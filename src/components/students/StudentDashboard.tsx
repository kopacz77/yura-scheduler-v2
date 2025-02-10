import { StatsProgressDataPoint, DashboardStats } from '@/types/stats';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export function StudentDashboard() {
  // TODO: Implement data fetching for student-specific stats
  const stats: DashboardStats = {
    totalStudents: { value: 0, trend: 'neutral', change: 0 },
    activeStudents: { value: 0, trend: 'neutral', change: 0 },
    revenue: { value: 0, trend: 'neutral', change: 0 },
    completedLessons: { value: 0, trend: 'neutral', change: 0 },
    monthlyProgress: []
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">My Progress</h2>
      </div>
      <div className="grid gap-4">
        <DashboardHeader stats={stats} />
      </div>
    </div>
  );
}
