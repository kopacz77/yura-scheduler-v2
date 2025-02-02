import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudentManagement } from '@/hooks/useStudentManagement';
import { ScheduleOverview } from '@/components/schedule/ScheduleOverview';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { StudentStats } from '@/components/admin/StudentStats';

export function AdminDashboard() {
  const { students } = useStudentManagement();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentStats students={students} />
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Schedule Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleOverview />
        </CardContent>
      </Card>

      <Card className="col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueChart />
        </CardContent>
      </Card>
    </div>
  );
}