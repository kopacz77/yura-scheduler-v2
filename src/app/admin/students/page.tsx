'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { StudentList } from '@/components/admin/StudentList';

export default function AdminStudentsPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Students"
        description="Manage your students"
      />
      <StudentList />
    </div>
  );
}