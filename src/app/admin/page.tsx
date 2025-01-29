'use client';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { RevenueReport } from '@/components/admin/reports/RevenueReport';
import { AttendanceReport } from '@/components/admin/reports/AttendanceReport';
import { PendingApprovals } from '@/components/admin/management/PendingApprovals';
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

      {/* Pending Approvals Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        <PendingApprovals />
        
        {/* Quick Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Card className="border-2 border-dashed">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-medium">Student Management</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Manage student profiles and progress
                    </p>
                    <Button 
                      variant="link" 
                      className="mt-2"
                      onClick={() => router.push('/admin/students')}
                    >
                      View Students
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-dashed">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-medium">Schedule Management</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      View and manage lessons
                    </p>
                    <Button 
                      variant="link" 
                      className="mt-2"
                      onClick={() => router.push('/admin/schedule')}
                    >
                      View Schedule
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">New Registration</p>
                    <p className="text-sm text-muted-foreground">Sarah Johnson registered for lessons</p>
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reports Section */}
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
