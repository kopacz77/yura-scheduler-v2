'use client';

import { useSession } from 'next-auth/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UpcomingLessons } from '../schedule/UpcomingLessons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarView } from '../schedule/CalendarView';
import { useState } from 'react';

export function StudentDashboard() {
  const { data: session } = useSession();
  const [currentWeek] = useState(new Date());

  if (!session?.user || session.user.role !== 'STUDENT') {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          You do not have permission to view this page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {session.user.name}</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarView currentWeek={currentWeek} readOnly />
          </CardContent>
        </Card>
        <UpcomingLessons />
      </div>
    </div>
  );
}
