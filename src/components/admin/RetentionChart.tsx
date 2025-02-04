'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function RetentionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Retention</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">Chart coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
}