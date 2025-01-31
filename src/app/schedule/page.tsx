'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Planner } from '@/components/planner/Planner';
import { usePlanner } from '@/hooks/usePlanner';

export default function SchedulePage() {
  const { resources, appointments } = usePlanner();

  return (
    <div className="space-y-4 p-8">
      <PageHeader
        title="Schedule"
        description="Manage your ice dance coaching schedule"
      />
      <Planner
        initialResources={resources}
        initialAppointments={appointments}
      />
    </div>
  );
}