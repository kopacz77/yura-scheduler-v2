'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
            <span>Email Notifications</span>
            <span className="text-sm text-muted-foreground">
              Receive email notifications for new bookings and updates
            </span>
          </Label>
          <Switch id="email-notifications" defaultChecked />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="sms-notifications" className="flex flex-col space-y-1">
            <span>SMS Notifications</span>
            <span className="text-sm text-muted-foreground">
              Receive text messages for booking reminders
            </span>
          </Label>
          <Switch id="sms-notifications" defaultChecked />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="marketing" className="flex flex-col space-y-1">
            <span>Marketing Updates</span>
            <span className="text-sm text-muted-foreground">
              Receive updates about new programs and promotions
            </span>
          </Label>
          <Switch id="marketing" />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="reminders" className="flex flex-col space-y-1">
            <span>Lesson Reminders</span>
            <span className="text-sm text-muted-foreground">
              Receive reminders 24 hours before scheduled lessons
            </span>
          </Label>
          <Switch id="reminders" defaultChecked />
        </div>
      </CardContent>
    </Card>
  );
}