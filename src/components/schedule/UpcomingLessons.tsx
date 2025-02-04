'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function UpcomingLessons() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Lessons</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Mock data */}
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-medium">Movement Training</h3>
              <p className="text-sm text-muted-foreground">Tomorrow at 3:00 PM</p>
            </div>
            <span className="text-sm font-medium">60 min</span>
          </div>
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-medium">Performance Training</h3>
              <p className="text-sm text-muted-foreground">Friday at 2:00 PM</p>
            </div>
            <span className="text-sm font-medium">90 min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}