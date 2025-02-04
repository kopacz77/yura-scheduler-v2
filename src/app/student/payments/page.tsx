'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';

export default function StudentPaymentsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Payments"
        description="View your payment history and upcoming payments"
      />
      <Card>
        <CardContent className="p-6">
          <p>Payments content will go here</p>
        </CardContent>
      </Card>
    </div>
  );
}