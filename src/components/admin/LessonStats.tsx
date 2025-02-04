'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LessonStats() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Total Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">150</p>
          <p className="text-sm text-muted-foreground">This month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">95%</p>
          <p className="text-sm text-muted-foreground">Last 30 days</p>
        </CardContent>
      </Card>
    </div>
  );
}