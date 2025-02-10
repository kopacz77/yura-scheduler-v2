import { DashboardStats } from '@/types/stats';

interface DashboardHeaderProps {
  stats?: DashboardStats;
}

export function DashboardHeader({ stats }: DashboardHeaderProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Students Card */}
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Total Students</div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold">{stats?.totalStudents.value || 0}</h3>
            <div className="flex items-center space-x-1">
              <span className={stats?.totalStudents.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {stats?.totalStudents.trend === 'up' ? '+' : '-'}{stats?.totalStudents.change || 0}
              </span>
              <span className="text-sm text-muted-foreground">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Students Card */}
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Active Students</div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold">{stats?.activeStudents.value || 0}</h3>
            <div className="flex items-center space-x-1">
              <span className={stats?.activeStudents.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {stats?.activeStudents.trend === 'up' ? '+' : '-'}{stats?.activeStudents.change || 0}
              </span>
              <span className="text-sm text-muted-foreground">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Revenue</div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold">
              ${((stats?.revenue.value || 0) / 100).toFixed(2)}
            </h3>
            <div className="flex items-center space-x-1">
              <span className={stats?.revenue.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {stats?.revenue.trend === 'up' ? '+' : '-'}${((stats?.revenue.change || 0) / 100).toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Lessons Card */}
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Completed Lessons</div>
          </div>
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold">{stats?.completedLessons.value || 0}</h3>
            <div className="flex items-center space-x-1">
              <span className={stats?.completedLessons.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {stats?.completedLessons.trend === 'up' ? '+' : '-'}{stats?.completedLessons.change || 0}
              </span>
              <span className="text-sm text-muted-foreground">from last month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
