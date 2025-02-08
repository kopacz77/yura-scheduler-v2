'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  key: string;
}

const notificationSettings: NotificationSetting[] = [
  {
    id: 'lesson-reminders',
    label: 'Lesson Reminders',
    description: 'Get notified about upcoming lessons 24 hours in advance',
    key: 'lessonReminders',
  },
  {
    id: 'schedule-changes',
    label: 'Schedule Changes',
    description: 'Receive notifications when your lesson schedule is modified',
    key: 'scheduleChanges',
  },
  {
    id: 'payment-reminders',
    label: 'Payment Reminders',
    description: 'Get reminded about pending payments',
    key: 'paymentReminders',
  },
];

export function NotificationSettings() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    lessonReminders: true,
    scheduleChanges: true,
    paymentReminders: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const updateSetting = async (key: string, value: boolean) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          value,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update notification settings');
      }

      setSettings(prev => ({
        ...prev,
        [key]: value,
      }));

      toast.success('Notification settings updated');
    } catch (error) {
      console.error('Notification settings update error:', error);
      toast.error('Failed to update notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose how you want to be notified about important updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {notificationSettings.map(setting => (
          <div
            key={setting.id}
            className="flex flex-row items-center justify-between space-y-0"
          >
            <div className="space-y-0.5">
              <Label htmlFor={setting.id}>{setting.label}</Label>
              <p className="text-sm text-muted-foreground">
                {setting.description}
              </p>
            </div>
            <Switch
              id={setting.id}
              checked={settings[setting.key]}
              onCheckedChange={(checked) => updateSetting(setting.key, checked)}
              disabled={isLoading}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
