'use client';

import AdminDashboard from '@/components/admin/AdminDashboard';
import PageHeader from '@/components/layout/PageHeader';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Admin Dashboard"
        description="Manage your skating school"
      />
      <AdminDashboard />
    </div>
  );
}