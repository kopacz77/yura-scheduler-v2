'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePaymentStats } from '@/hooks/usePaymentStats';
import { Skeleton } from '@/components/ui/skeleton';

export default function PaymentsPage() {
  const { stats, isLoading } = usePaymentStats();

  if (isLoading) {
    return (
      <div className="space-y-4 p-8">
        <PageHeader
          title="Payments"
          description="Track and manage payments"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[100px]" />
                <Skeleton className="mt-2 h-4 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-8">
      <PageHeader
        title="Payments"
        description="Track and manage payments"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${stats?.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">+{stats?.revenueGrowth}% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${stats?.pendingAmount.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{stats?.pendingCount} payments pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Lesson Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${stats?.averageRate}</p>
            <p className="text-sm text-muted-foreground">Per hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Recurring</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${stats?.recurringRevenue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{stats?.recurringStudents} recurring students</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}