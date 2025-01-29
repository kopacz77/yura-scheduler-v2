'use client';

import { EmailPreview } from '@/components/admin/settings/EmailPreview';

export default function EmailTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Email Templates</h1>
      <EmailPreview />
    </div>
  );
}
