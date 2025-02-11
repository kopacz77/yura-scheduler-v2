'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

interface NotificationSetting {
  key: string;
  title: string;
  description: string;
  defaultEnabled: boolean;
}

const notificationSettings: NotificationSetting[] = [
  {
    key: 'lessonReminders',
    title: 'Lesson Reminders',
    description: 'Receive reminders before upcoming lessons',
    defaultEnabled: true,
  },
  {
    key: 'paymentReminders',
    title: 'Payment Reminders',
    description: 'Get notified about pending payments',
    defaultEnabled: true,
  },
  {
    key: 'scheduleChanges',
    title: 'Schedule Changes',
    description: 'Get notified when there are changes to your schedule',
    defaultEnabled: true,
  },
  {
    key: 'announcements',
    title: 'Announcements',
    description: 'Receive studio announcements and updates',
    defaultEnabled: true,
  },
];

interface NotificationSettingsProps {
  onUpdateSetting?: (key: string, enabled: boolean) => Promise<void>;
}

export function NotificationSettings({ onUpdateSetting }: NotificationSettingsProps) {
  const [settings, setSettings] = useState(() =>
    notificationSettings.reduce(
      (acc, setting) => ({
        ...acc,
        [setting.key]: setting.defaultEnabled,
      }),
      {}
    )
  );

  const updateSetting = async (key: string, enabled: boolean) => {
    try {
      if (onUpdateSetting) {
        await onUpdateSetting(key, enabled);
      }
      setSettings(prev => ({ ...prev, [key]: enabled }));
    } catch (error) {
      console.error('Failed to update notification setting:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {notificationSettings.map((setting) => (
          <div
            key={setting.key}
            className="flex items-center justify-between space-x-2"
          >
            <div className="space-y-0.5">
              <div className="text-sm font-medium">{setting.title}</div>
              <div className="text-sm text-muted-foreground">
                {setting.description}
              </div>
            </div>
            <Switch
              checked={settings[setting.key] ?? setting.defaultEnabled}
              onCheckedChange={(checked) => updateSetting(setting.key, checked)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}