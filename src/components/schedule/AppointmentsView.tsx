'use client';

import { Calendar } from '@/components/calendar/Calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { format, startOfWeek } from 'date-fns';

interface AppointmentsViewProps {
  appointments: any[];
  isLoading?: boolean;
}

export function AppointmentsView({ appointments = [], isLoading }: AppointmentsViewProps) {
  const currentWeek = startOfWeek(new Date());

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-32 animate-pulse rounded bg-muted" />
        <div className="h-[400px] animate-pulse rounded bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
        <TabsContent value="calendar">
          <Calendar currentWeek={currentWeek} lessons={appointments} />
        </TabsContent>
        <TabsContent value="list">
          <Card>
            <div className="divide-y">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{appointment.student.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(appointment.startTime), 'PPp')}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {appointment.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}