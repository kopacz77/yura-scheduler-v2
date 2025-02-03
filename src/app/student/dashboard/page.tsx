'use client';

import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/PageHeader';
import { useAuth } from '@/contexts/auth-context';

export default function StudentDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={`Welcome, ${user?.name}`}
        description="View your schedule and progress"
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <h3 className="font-semibold">Upcoming Lessons</h3>
          <p className="mt-2 text-2xl font-bold">3</p>
          <Button className="mt-4" variant="outline" size="sm">
            View Schedule
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold">Total Hours</h3>
          <p className="mt-2 text-2xl font-bold">24</p>
          <Button className="mt-4" variant="outline" size="sm">
            View History
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold">Next Payment</h3>
          <p className="mt-2 text-2xl font-bold">$180</p>
          <Button className="mt-4" variant="outline" size="sm">
            View Details
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold">Progress Track</h3>
          <p className="mt-2 text-2xl font-bold">Level 3</p>
          <Button className="mt-4" variant="outline" size="sm">
            View Progress
          </Button>
        </Card>
      </div>
    </div>
  );
}
