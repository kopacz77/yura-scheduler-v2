'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="space-y-4 p-8">
      <PageHeader
        title="Settings"
        description="Manage your scheduling preferences and account settings"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure your available coaching hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lesson Types</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage different types of lessons and their durations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Set up pricing for different lesson types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure email and SMS notifications
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}