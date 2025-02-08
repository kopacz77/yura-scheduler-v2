'use client';

import EmailPreview from '@/components/admin/settings/EmailPreview';
import PageHeader from '@/components/layout/PageHeader';

export default function EmailSettingsPage() {
  const sampleTemplate = 'Hello {name},\n\nYour lesson is scheduled for {time} at {location}.\n\nBest regards,\nYura';
  
  const sampleVariables = {
    name: 'John Smith',
    time: '3:00 PM',
    location: 'World Ice Arena'
  };

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Email Settings"
        description="Manage email templates and notifications"
      />
      <EmailPreview 
        template={sampleTemplate}
        variables={sampleVariables}
      />
    </div>
  );
}