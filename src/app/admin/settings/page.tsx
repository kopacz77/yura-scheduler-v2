'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BusinessHours } from '@/components/admin/settings/BusinessHours';
import { RinkSettings } from '@/components/admin/settings/RinkSettings';
import { PricingConfig } from '@/components/admin/settings/PricingConfig';
import { EmailPreview } from '@/components/admin/settings/EmailPreview';

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Settings</h1>
      
      <Tabs defaultValue="business-hours" className="space-y-6">
        <TabsList>
          <TabsTrigger value="business-hours">Business Hours</TabsTrigger>
          <TabsTrigger value="rinks">Rinks</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="email">Email Templates</TabsTrigger>
        </TabsList>

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
      </Tabs>
    </div>
  );
}
