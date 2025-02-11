import { DashboardStats } from '@/types/stats';

export function StudentDashboard() {
  const stats: DashboardStats = {
    totalStudents: { value: 0, trend: 'neutral', change: 0 },
    activeStudents: { value: 0, trend: 'neutral', change: 0 },
    revenue: { value: 0, trend: 'neutral', change: 0 },
    completedLessons: { value: 0, trend: 'neutral', change: 0 },
    monthlyProgress: [],
    distribution: [{ name: 'Initial', count: 0, color: '#94a3b8' }]
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">My Progress</h2>
      {/* Student dashboard content goes here */}
    </div>
  );
}