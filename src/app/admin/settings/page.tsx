'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { BusinessHours } from '@/components/admin/settings/BusinessHours';
import { RinkSettings } from '@/components/admin/settings/RinkSettings';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Settings"
        description="Manage your business settings"
      />
      <div className="grid gap-6">
        <BusinessHours />
        <RinkSettings />
      </div>
    </div>
  );
}