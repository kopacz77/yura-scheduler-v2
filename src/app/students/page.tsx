'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { StudentList } from '@/components/students/StudentList';

export default function StudentsPage() {
  return (
    <div className="space-y-4 p-8">
      <PageHeader
        title="Students"
        description="Manage your students and their profiles"
      />
      <StudentList />
    </div>
  );
}