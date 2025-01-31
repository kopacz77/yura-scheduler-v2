'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';

// Settings components
import { BusinessHours } from '@/components/admin/settings/BusinessHours';
import { RinkSettings } from '@/components/admin/settings/RinkSettings';
import { PricingConfig } from '@/components/admin/settings/PricingConfig';
import { EmailPreview } from '@/components/admin/settings/EmailPreview';
import { UserSettings } from '@/components/settings/UserSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';

export default function SettingsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-4 p-8">
      <PageHeader
        title="Settings"
        description="Manage your account and application settings"
      />
      
      <Tabs defaultValue="user" className="space-y-6">
        <TabsList>
          <TabsTrigger value="user">User Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {isAdmin && (
            <>
              <TabsTrigger value="business-hours">Business Hours</TabsTrigger>
              <TabsTrigger value="rinks">Rinks</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="email">Email Templates</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="user" className="mt-6">
          <UserSettings />
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <NotificationSettings />
        </TabsContent>

        {isAdmin && (
          <>
            <TabsContent value="business-hours" className="mt-6">
              <BusinessHours />
            </TabsContent>

            <TabsContent value="rinks" className="mt-6">
              <RinkSettings />
            </TabsContent>

            <TabsContent value="pricing" className="mt-6">
              <PricingConfig />
            </TabsContent>

            <TabsContent value="email" className="mt-6">
              <EmailPreview />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}