'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Track</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">Progress visualization coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
}