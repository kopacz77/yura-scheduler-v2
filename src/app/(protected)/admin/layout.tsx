'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="container mx-auto px-4 py-8">
        <PageHeader 
          title="Admin Dashboard"
          description="Manage your ice dance coaching business"
        />
        {children}
      </div>
    </ProtectedRoute>
  );
}