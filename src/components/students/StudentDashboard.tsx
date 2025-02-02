import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UpcomingLessons } from '@/components/schedule/UpcomingLessons';
import { PaymentHistory } from '@/components/payments/PaymentHistory';
import { ProgressChart } from '@/components/students/ProgressChart';

export function StudentDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Upcoming Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <UpcomingLessons />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentHistory />
        </CardContent>
      </Card>
    </div>
  );
}