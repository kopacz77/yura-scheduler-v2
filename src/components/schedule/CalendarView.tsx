'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { format, addDays, isSameDay, isToday, parse, addMinutes } from 'date-fns';
import { cn } from '@/lib/utils';
import { UserCircle2, Clock, Calendar, MapPin } from 'lucide-react';
import { Lesson, RinkTimeSlot, Rink } from '@prisma/client';
import { useMemo } from 'react';

interface CalendarViewProps {
  currentWeek: Date;
  lessons: Array<Lesson & {
    student: {
      user: {
        name: string | null;
      };
    };
  }>;
  timeSlots: Array<RinkTimeSlot & {
    rink: Rink;
  }>;
  onSlotSelect?: (date: Date) => void;
  onLessonSelect?: (lesson: Lesson) => void;
}

const TIME_SLOTS = Array.from({ length: 32 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6;
  const minutes = (i % 2) * 30;
  return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
});

export function CalendarView({ 
  currentWeek,
  lessons,
  timeSlots,
  onSlotSelect,
  onLessonSelect
}: CalendarViewProps) {
  const weekDays = useMemo(() => (
    Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i))
  ), [currentWeek]);

  const getTimeSlotForCell = (day: Date, timeSlot: string) => {
    const dayOfWeek = day.getDay();
    return timeSlots.find(ts => {
      return ts.daysOfWeek.includes(dayOfWeek) && 
             ts.startTime === timeSlot;
    });
  };

  const isSlotPast = (day: Date, timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotTime = new Date(day);
    slotTime.setHours(hours, minutes, 0, 0);
    return slotTime < new Date();
  };

  const getEndTime = (startTime: string, duration: number = 60) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return format(addMinutes(date, duration), 'HH:mm');
  };

  return (
    <Card className="overflow-hidden border rounded-lg shadow-sm">
      <CardHeader className="bg-primary/5 py-3 px-4 border-b">
        <div className="flex items-center space-x-2 text-primary">
          <Calendar className="h-5 w-5" />
          <h3 className="font-semibold">Weekly Schedule</h3>
        </div>
      </CardHeader>

      <div className="grid" style={{ gridTemplateColumns: '6rem repeat(7, minmax(150px, 1fr))' }}>
        {/* Calendar Header */}
        <div className="sticky top-0 z-10 grid" style={{ gridTemplateColumns: 'inherit' }}>
          <div className="p-3 font-medium text-muted-foreground border-r text-sm bg-muted/50">
            Time
          </div>
          {weekDays.map(day => (
            <div
              key={day.toISOString()}
              className={cn(
                'p-3 text-center border-r bg-muted/50',
                isToday(day) && 'bg-primary/10'
              )}
            >
              <div className="font-medium text-base">{format(day, 'EEE')}</div>
              <div className="text-sm text-muted-foreground font-medium">
                {format(day, 'MMM d')}
              </div>
            </div>
          ))}
        </div>

        {/* Time Slots */}
        <div className="col-span-full">
          {TIME_SLOTS.map(timeSlot => (
            <div 
              key={timeSlot} 
              className="grid"
              style={{ gridTemplateColumns: 'inherit' }}
            >
              <div className="p-2 border-r border-b text-sm font-medium text-muted-foreground flex items-center justify-end pr-4">
                {format(parse(timeSlot, 'HH:mm', new Date()), 'h:mm a')}
              </div>
              {weekDays.map(day => {
                const availableSlot = getTimeSlotForCell(day, timeSlot);
                const isPast = isSlotPast(day, timeSlot);

                if (availableSlot && availableSlot.startTime === timeSlot) {
                  return (
                    <div
                      key={`${day.toISOString()}-${timeSlot}`}
                      className={cn(
                        'p-2 border-r border-b relative transition-colors',
                        !isPast && 'cursor-pointer hover:bg-primary/5',
                        'bg-blue-100/90 dark:bg-blue-900/20'
                      )}
                      style={{ gridRow: 'span 2' }}
                      onClick={() => {
                        if (!isPast && onSlotSelect) {
                          const [hours, minutes] = timeSlot.split(':').map(Number);
                          const selectedDate = new Date(day);
                          selectedDate.setHours(hours, minutes, 0, 0);
                          onSlotSelect(selectedDate);
                        }
                      }}
                    >
                      <div className="text-xs text-muted-foreground p-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{availableSlot.rink.name}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {format(parse(availableSlot.startTime, 'HH:mm', new Date()), 'h:mm a')} -
                            {format(parse(getEndTime(availableSlot.startTime), 'HH:mm', new Date()), 'h:mm a')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={`${day.toISOString()}-${timeSlot}`}
                    className="border-r border-b p-2"
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}