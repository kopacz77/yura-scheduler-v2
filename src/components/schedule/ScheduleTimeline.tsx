'use client';

import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  studentId: string;
  resourceId: string;
  lessonType: string;
}

interface ScheduleTimelineProps {
  date: Date;
  appointments: Appointment[];
  isLoading?: boolean;
  timeZone?: string;
}

export function ScheduleTimeline({
  date,
  appointments,
  isLoading = false,
  timeZone = 'America/New_York'
}: ScheduleTimelineProps) {
  // Convert times to local timezone
  const localDate = utcToZonedTime(date, timeZone);
  const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 10 PM

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] w-full">
      <div className="space-y-2">
        {hours.map(hour => {
          const hourAppointments = appointments.filter(app => {
            const appTime = utcToZonedTime(new Date(app.start), timeZone);
            return appTime.getHours() === hour;
          });

          return (
            <div key={hour} className="flex items-start space-x-4 py-2">
              <div className="w-20 text-sm text-muted-foreground">
                {format(new Date().setHours(hour, 0, 0, 0), 'h:mm a')}
              </div>
              <div className="flex-1">
                {hourAppointments.map(appointment => (
                  <div
                    key={appointment.id}
                    className="mb-2 rounded-md bg-primary/10 p-2 text-sm"
                  >
                    <div className="font-medium">{appointment.title}</div>
                    <div className="text-muted-foreground">
                      {format(utcToZonedTime(new Date(appointment.start), timeZone), 'h:mm a')} -
                      {format(utcToZonedTime(new Date(appointment.end), timeZone), 'h:mm a')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
