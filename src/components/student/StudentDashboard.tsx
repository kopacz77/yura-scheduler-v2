'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CreditCard, Trophy } from 'lucide-react';
import { ScheduleOverview } from '@/components/schedule/ScheduleOverview';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/contexts/auth-context';

export function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Lesson</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Tomorrow</div>
            <p className="text-xs text-muted-foreground">3:00 PM - 4:00 PM</p>
            <Button variant="link" className="mt-2 h-auto p-0">
              View Schedule
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24 hrs</div>
            <p className="text-xs text-muted-foreground">+2 hrs this week</p>
            <Button variant="link" className="mt-2 h-auto p-0">
              View History
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$180.00</div>
            <p className="text-xs text-muted-foreground">Due in 5 days</p>
            <Button variant="link" className="mt-2 h-auto p-0">
              Make Payment
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level Progress</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Level 3</div>
            <p className="text-xs text-muted-foreground">80% to Level 4</p>
            <Button variant="link" className="mt-2 h-auto p-0">
              View Progress
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>My Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleOverview />
        </CardContent>
      </Card>

      {/* Training Progress */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Edge Control</p>
                  <p className="text-sm text-muted-foreground">Level 3 Exercise</p>
                </div>
                <Button size="sm">Practice Now</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Step Sequence</p>
                  <p className="text-sm text-muted-foreground">Level 2 Complete</p>
                </div>
                <Button size="sm">Next Level</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">January Package</p>
                  <p className="text-sm text-muted-foreground">8 lessons - Paid</p>
                </div>
                <p className="font-medium">$720.00</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">December Package</p>
                  <p className="text-sm text-muted-foreground">6 lessons - Paid</p>
                </div>
                <p className="font-medium">$540.00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
