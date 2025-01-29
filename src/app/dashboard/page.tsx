import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StudentOverview } from '@/components/dashboard/StudentOverview';
import { UpcomingLessons } from '@/components/dashboard/UpcomingLessons';
import { StudentProgress } from '@/components/dashboard/StudentProgress';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <DashboardHeader />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <StudentOverview />
        <UpcomingLessons />
      </div>

      <StudentProgress />
    </div>
  );
}
