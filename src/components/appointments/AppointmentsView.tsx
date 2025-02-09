'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Calendar } from '@/components/ui/calendar';
import { ScheduleTimeline } from '@/components/schedule/ScheduleTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  studentId: string;
  resourceId: string;
  lessonType: string;
}

interface AppointmentsViewProps {
  initialDate?: Date;
  timeZone?: string;
}

export function AppointmentsView({ 
  initialDate = new Date(), 
  timeZone = 'America/New_York' 
}: AppointmentsViewProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAppointments = async (date: Date) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/appointments?date=${format(date, 'yyyy-MM-dd')}`);
      if (!response.ok) throw new Error('Failed to fetch appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      fetchAppointments(date);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Appointments Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={{ before: new Date() }}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Schedule for {format(utcToZonedTime(selectedDate, timeZone), 'MMMM d, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleTimeline
            date={selectedDate}
            appointments={appointments}
            isLoading={isLoading}
            timeZone={timeZone}
          />
        </CardContent>
      </Card>
    </div>
  );
}
