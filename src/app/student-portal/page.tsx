'use client';

import { Suspense } from 'react';
import { StudentDashboard } from '@/components/students/StudentDashboard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function StudentPortalPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Student Portal</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <StudentDashboard />
      </Suspense>
    </div>
  );
}