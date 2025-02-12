import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface RecentAppointmentsProps {
  className?: string;
}

const recentAppointments = [
  {
    id: 1,
    studentName: 'Sarah Johnson',
    date: new Date(),
    time: '10:00 AM',
    type: 'Private Lesson',
    status: 'Completed'
  },
  {
    id: 2,
    studentName: 'Michael Chen',
    date: new Date(),
    time: '11:30 AM',
    type: 'Group Class',
    status: 'Upcoming'
  },
  {
    id: 3,
    studentName: 'Emma Davis',
    date: new Date(),
    time: '2:00 PM',
    type: 'Private Lesson',
    status: 'Cancelled'
  }
];

export function RecentAppointments({ className }: RecentAppointmentsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <span className="text-sm">
                    {appointment.studentName.split(' ').map(n => n[0]).join('')}
                  </span>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{appointment.studentName}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(appointment.date, 'MMM d')} at {appointment.time}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm">{appointment.type}</p>
                <p className={cn(
                  'text-xs',
                  appointment.status === 'Completed' ? 'text-green-500' : 
                  appointment.status === 'Cancelled' ? 'text-red-500' : 
                  'text-blue-500'
                )}>
                  {appointment.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}