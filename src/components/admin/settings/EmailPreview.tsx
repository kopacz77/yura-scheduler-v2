'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function EmailPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">Email preview content will go here</p>
        </div>
      </CardContent>
    </Card>
  );
}