'use client';

import { StudentDashboard } from '@/components/students/StudentDashboard';
import { PageHeader } from '@/components/layout/PageHeader';

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="My Dashboard"
        description="View your schedule, payments, and progress"
      />
      <StudentDashboard />
    </div>
  );
}