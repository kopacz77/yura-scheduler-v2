'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentsPage() {
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
            <p className="text-2xl font-bold">$12,345</p>
            <p className="text-sm text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$2,145</p>
            <p className="text-sm text-muted-foreground">8 payments pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Lesson Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$85</p>
            <p className="text-sm text-muted-foreground">Per hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Recurring</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$8,940</p>
            <p className="text-sm text-muted-foreground">15 recurring students</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}