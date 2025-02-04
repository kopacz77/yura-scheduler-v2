'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';

export default function StudentSettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Settings"
        description="Manage your account settings"
      />
      <Card>
        <CardContent className="p-6">
          <p>Settings content will go here</p>
        </CardContent>
      </Card>
    </div>
  );
}