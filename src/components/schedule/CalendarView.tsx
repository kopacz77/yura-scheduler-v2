'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Lesson } from '@/types/schedule';
import { format, addDays, endOfWeek, isSameDay, parseISO, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { UserCircle2, Clock } from 'lucide-react';

interface CalendarViewProps {
  currentWeek: Date;
  lessons: (Lesson & { student?: { name: string } })[];
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
  onSlotSelect,
  onLessonSelect
}: CalendarViewProps) {
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

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
    <Card className="overflow-hidden border rounded-lg">
      {/* Calendar Header */}
      <div className="grid grid-cols-8 border-b bg-muted/50">
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
            <div className="font-medium">{format(day, 'EEE')}</div>
            <div className="text-sm text-muted-foreground">
              {format(day, 'MMM d')}
            </div>
          </div>
        ))}
      </div>

      {/* Time Slots */}
      <div className="overflow-auto max-h-[600px]">
        {TIME_SLOTS.map(timeSlot => (
          <div key={timeSlot} className="grid grid-cols-8 border-b hover:bg-muted/5">
            <div className="p-2 border-r text-sm text-muted-foreground">
              {timeSlot}
            </div>
            {weekDays.map(day => {
              const lesson = getLessonForSlot(day, timeSlot);
              const isPast = isSlotPast(day, timeSlot);

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'p-2 border-r min-h-[60px] relative group',
                    !isPast && !lesson && 'cursor-pointer hover:bg-primary/5',
                    lesson && 'bg-primary/10'
                  )}
                  onClick={() => {
                    if (!isPast && !lesson && onSlotSelect) {
                      const [hours, minutes] = timeSlot.split(':').map(Number);
                      const selectedDate = new Date(day);
                      selectedDate.setHours(hours, minutes, 0, 0);
                      onSlotSelect(selectedDate);
                    } else if (lesson && onLessonSelect) {
                      onLessonSelect(lesson);
                    }
                  }}
                >
                  {lesson && (
                    <div 
                      className={cn(
                        'p-2 rounded text-xs space-y-1',
                        lesson.status === 'cancelled' && 'line-through opacity-50'
                      )}
                    >
                      <div className="flex items-center space-x-1">
                        <UserCircle2 className="h-3 w-3" />
                        <span className="font-medium truncate">
                          {lesson.student?.name || 'Student'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {format(parseISO(lesson.startTime.toString()), 'h:mm a')} -
                          {format(parseISO(lesson.endTime.toString()), 'h:mm a')}
                        </span>
                      </div>
                    </div>
                  )}
                  {!isPast && !lesson && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-xs text-primary font-medium">
                        Click to schedule
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