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

  const getSlotEndTime = (startTimeStr: string, minutes: number) => {
    const [hours, mins] = startTimeStr.split(':').map(Number);
    const startTime = new Date();
    startTime.setHours(hours, mins, 0, 0);
    const endTime = addMinutes(startTime, minutes);
    return format(endTime, 'HH:mm');
  };

  const getLessonForSlot = (day: Date, timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotTime = new Date(day);
    slotTime.setHours(hours, minutes, 0, 0);

    return lessons.find(lesson => {
      const startTime = new Date(lesson.startTime);
      return isSameDay(startTime, day) && 
             startTime.getHours() === hours && 
             startTime.getMinutes() === minutes;
    });
  };

  const isSlotPast = (day: Date, timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotTime = new Date(day);
    slotTime.setHours(hours, minutes, 0, 0);
    return slotTime < new Date();
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
      <div className="grid grid-cols-[6rem_repeat(7,1fr)] bg-muted/50 border-b">
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

      {/* Time Slots Grid */}
      <div className="overflow-auto max-h-[600px] bg-background/50">
        {TIME_SLOTS.map(timeSlot => (
          <div 
            key={timeSlot} 
            className={cn(
              "grid grid-cols-[6rem_repeat(7,1fr)] border-b hover:bg-muted/5 transition-colors",
              timeSlot.endsWith('00') && 'bg-muted/5'
            )}
          >
            <div className="p-2 border-r text-sm font-medium text-muted-foreground flex items-center justify-end pr-4">
              {format(parse(timeSlot, 'HH:mm', new Date()), 'h:mm a')}
            </div>
            {weekDays.map(day => {
              const lesson = getLessonForSlot(day, timeSlot);
              const availableSlot = getTimeSlotForCell(day, timeSlot);
              const isPast = isSlotPast(day, timeSlot);

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'p-2 border-r min-h-[4rem] relative group transition-colors',
                    !isPast && availableSlot && !lesson && 'cursor-pointer hover:bg-primary/5',
                    lesson && 'bg-primary/10 hover:bg-primary/15',
                    isPast && 'bg-muted/5',
                    availableSlot && !lesson && 'bg-blue-50/50'
                  )}
                  onClick={() => {
                    if (!isPast && availableSlot && !lesson && onSlotSelect) {
                      const [hours, minutes] = timeSlot.split(':').map(Number);
                      const selectedDate = new Date(day);
                      selectedDate.setHours(hours, minutes, 0, 0);
                      onSlotSelect(selectedDate);
                    } else if (lesson && onLessonSelect) {
                      onLessonSelect(lesson);
                    }
                  }}
                >
                  {availableSlot && !lesson && (
                    <div className="text-xs text-muted-foreground p-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{availableSlot.rink.name}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {format(parse(availableSlot.startTime, 'HH:mm', new Date()), 'h:mm a')} -
                          {format(parse(getSlotEndTime(availableSlot.startTime, 60), 'HH:mm', new Date()), 'h:mm a')}
                        </span>
                      </div>
                    </div>
                  )}
                  {lesson && (
                    <div 
                      className={cn(
                        'p-2 rounded-md bg-primary/20 text-xs space-y-1 shadow-sm transition-all',
                        'hover:scale-[1.02] hover:shadow-md cursor-pointer',
                        lesson.status === 'CANCELLED' && 'line-through opacity-50'
                      )}
                    >
                      <div className="flex items-center space-x-1">
                        <UserCircle2 className="h-3 w-3 text-primary" />
                        <span className="font-medium truncate">
                          {lesson.student?.user?.name || 'Unnamed Student'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {format(new Date(lesson.startTime), 'h:mm a')} -
                          {format(new Date(lesson.endTime), 'h:mm a')}
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