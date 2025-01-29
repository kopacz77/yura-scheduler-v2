'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { RevenueReport } from '@/components/admin/reports/RevenueReport';
import { AttendanceReport } from '@/components/admin/reports/AttendanceReport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  
  return (
    <div className="container mx-auto space-y-8 p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      {/* Overview Stats */}
      <DashboardHeader 
        stats={{
          totalStudents: 45,
          weeklyLessons: 120,
          outstandingAmount: 1250.00,
          averageProgress: 85
        }}
        isLoading={false}
      />
      
      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Student Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage student profiles, track progress, and handle registrations.
            </p>
            <Button 
              variant="link" 
              className="p-0"
              onClick={() => router.push('/admin/students')}
            >
              View Students
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              View and manage lesson schedules, rink allocations, and instructors.
            </p>
            <Button 
              variant="link" 
              className="p-0"
              onClick={() => router.push('/admin/schedule')}
            >
              View Schedule
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Track payments, manage invoices, and handle financial records.
            </p>
            <Button 
              variant="link" 
              className="p-0"
              onClick={() => router.push('/admin/payments')}
            >
              View Payments
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">New Student Registration</p>
                <p className="text-sm text-muted-foreground">Sarah Johnson registered for intermediate lessons</p>
              </div>
              <p className="text-sm text-muted-foreground">2 hours ago</p>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Payment Received</p>
                <p className="text-sm text-muted-foreground">$150.00 received for private lessons</p>
              </div>
              <p className="text-sm text-muted-foreground">5 hours ago</p>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Schedule Update</p>
                <p className="text-sm text-muted-foreground">Group lesson rescheduled for next Tuesday</p>
              </div>
              <p className="text-sm text-muted-foreground">Yesterday</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Overview */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Revenue Overview</h2>
            <Button 
              variant="ghost"
              onClick={() => router.push('/admin/reports?tab=revenue')}
            >
              Full Report
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <RevenueReport />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Attendance Overview</h2>
            <Button 
              variant="ghost"
              onClick={() => router.push('/admin/reports?tab=attendance')}
            >
              Full Report
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <AttendanceReport />
        </div>
      </div>
    </div>
  );
}
