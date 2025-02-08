'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { UserProfile } from '@/components/settings/UserProfile';
import { EmailPreview } from '@/components/admin/settings/EmailPreview';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');

  // Sample email template for preview
  const sampleTemplate = `Dear {name},

This is a reminder about your upcoming lesson on {date} at {time}.
Location: {location}

Please arrive 10 minutes early to prepare.

Best regards,
Yura Min`;

  const sampleVariables = {
    name: 'John Smith',
    date: 'February 10, 2025',
    time: '3:00 PM',
    location: 'World Ice Arena'
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
      />

      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            {session?.user.role === 'ADMIN' && (
              <TabsTrigger value="email">Email Templates</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <UserProfile />
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <NotificationSettings />
          </TabsContent>

          {session?.user.role === 'ADMIN' && (
            <TabsContent value="email" className="mt-6">
              <EmailPreview 
                template={sampleTemplate}
                variables={sampleVariables}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
