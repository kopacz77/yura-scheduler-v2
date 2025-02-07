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

      {/* Calendar Header */}
      <div className="grid grid-cols-[6rem_repeat(7,_1fr)] bg-muted/50 border-b">
        <div className="p-3 font-medium text-muted-foreground border-r text-sm">
          Time
        </div>
        {weekDays.map(day => (
          <div
            key={day.toISOString()}
            className={cn(
              'p-3 text-center border-r',
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
      <div className="overflow-auto max-h-[600px] bg-background/50">
        {TIME_SLOTS.map((timeSlot, index) => (
          <div 
            key={timeSlot} 
            className={cn(
              "grid grid-cols-[6rem_repeat(7,_1fr)] border-b",
              timeSlot.endsWith('00') && 'bg-muted/5'
            )}
          >
            <div className="p-2 border-r text-sm font-medium text-muted-foreground flex items-center justify-end pr-4 min-h-[4rem]">
              {format(parse(timeSlot, 'HH:mm', new Date()), 'h:mm a')}
            </div>
            {weekDays.map(day => {
              const availableSlot = getTimeSlotForCell(day, timeSlot);
              const isPast = isSlotPast(day, timeSlot);

              // Check if this is a continuation cell of a previous slot
              const prevTimeSlot = index > 0 ? TIME_SLOTS[index - 1] : null;
              const prevSlot = prevTimeSlot ? getTimeSlotForCell(day, prevTimeSlot) : null;
              if (prevSlot && prevSlot === availableSlot) {
                return null;
              }

              return (
                <div
                  key={`${day.toISOString()}-${timeSlot}`}
                  className={cn(
                    'border-r relative transition-colors p-2 min-h-[4rem]',
                    !isPast && availableSlot && 'cursor-pointer hover:bg-primary/5',
                    availableSlot && 'bg-blue-100 dark:bg-blue-900/20 row-span-2'
                  )}
                  style={availableSlot ? { gridRow: 'span 2' } : {}}
                  onClick={() => {
                    if (!isPast && availableSlot && onSlotSelect) {
                      const [hours, minutes] = timeSlot.split(':').map(Number);
                      const selectedDate = new Date(day);
                      selectedDate.setHours(hours, minutes, 0, 0);
                      onSlotSelect(selectedDate);
                    }
                  }}
                >
                  {availableSlot && (
                    <div className="text-xs text-muted-foreground">
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
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Card>
  );
}