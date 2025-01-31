'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Planner } from '@/components/planner/Planner';

export default function SchedulePage() {
  return (
    <div className="space-y-4 p-8">
      <PageHeader
        title="Schedule"
        description="Manage your ice dance coaching schedule"
      />
      <Planner />
    </div>
  );
}