import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { PaymentStatus, LessonType } from '@prisma/client';
import type { AppointmentWithRelations } from '@/types/scheduling';

export function StudentDashboard() {
  const [upcomingLessons, setUpcomingLessons] = useState<AppointmentWithRelations[]>([]);
  const [pastLessons, setPastLessons] = useState<AppointmentWithRelations[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch upcoming lessons
      const lessonsResponse = await fetch('/api/appointments/student');
      if (!lessonsResponse.ok) throw new Error('Failed to fetch lessons');
      const lessonsData = await lessonsResponse.json();
      
      const now = new Date();
      setUpcomingLessons(lessonsData.filter((lesson: AppointmentWithRelations) => 
        new Date(lesson.start) > now
      ));
      setPastLessons(lessonsData.filter((lesson: AppointmentWithRelations) => 
        new Date(lesson.start) <= now
      ));

      // Fetch payments
      const paymentsResponse = await fetch('/api/payments/student');
      if (!paymentsResponse.ok) throw new Error('Failed to fetch payments');
      const paymentsData = await paymentsResponse.json();
      setPayments(paymentsData);

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingLessons.map((lesson) => (
                <div key={lesson.id} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <p className="font-medium">
                      {format(new Date(lesson.start), 'PPp')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {lesson.lessonType.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {lesson.resource.name}
                    </p>
                  </div>
                </div>
              ))}
              {upcomingLessons.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No upcoming lessons
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments
                .filter(payment => payment.status === PaymentStatus.PENDING)
                .map((payment) => (
                  <div key={payment.id} className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">${payment.amount}</p>
                        <p className="text-sm text-gray-600">
                          Due for: {format(new Date(payment.appointment.start), 'PP')}
                        </p>
                      </div>
                      <Badge variant="warning">Pending</Badge>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Pay via {payment.method}:</p>
                      {payment.method === 'VENMO' ? (
                        <p>@yura-min</p>
                      ) : (
                        <p>zelle@yuramin.com</p>
                      )}
                    </div>
                  </div>
                ))}
              {payments
                .filter(payment => payment.status === PaymentStatus.PENDING)
                .length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No pending payments
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* This would be expanded with actual progress tracking */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Recent Achievements</h4>
                <div className="space-y-2">
                  {pastLessons.slice(0, 3).map((lesson) => (
                    <div key={lesson.id} className="text-sm">
                      <p className="text-gray-600">
                        {format(new Date(lesson.start), 'PP')}
                      </p>
                      <p>{lesson.notes || 'No notes recorded'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="lessons" className="w-full">
        <TabsList>
          <TabsTrigger value="lessons">Lesson History</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons">
          <Card>
            <CardHeader>
              <CardTitle>Lesson History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pastLessons.map((lesson) => (
                  <div key={lesson.id} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">
                        {format(new Date(lesson.start), 'PPp')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {lesson.lessonType.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-gray-600">
                        {lesson.resource.name}
                      </p>
                      {lesson.notes && (
                        <p className="mt-2 text-sm">{lesson.notes}</p>
                      )}
                    </div>
                    <Badge>
                      {lesson.payment?.status || 'No Payment'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">${payment.amount}</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(payment.appointment.start), 'PP')}
                      </p>
                      <p className="text-sm text-gray-600">
                        Method: {payment.method}
                      </p>
                      {payment.confirmationId && (
                        <p className="text-sm text-gray-600">
                          Confirmation: {payment.confirmationId}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={payment.status === 'PAID' ? 'success' : 'warning'}
                    >
                      {payment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
