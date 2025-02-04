'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';

export default function StudentSchedulePage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="My Schedule"
        description="View and manage your training schedule"
      />
      <Card>
        <CardContent className="p-6">
          <p>Schedule content will go here</p>
        </CardContent>
      </Card>
    </div>
  );
}