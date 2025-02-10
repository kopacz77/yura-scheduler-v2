'use client';

import { useMemo } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { TimeSlot, Lesson } from '@/types/schedule';

interface CalendarViewProps {
  currentWeek: Date;
  lessons: Lesson[];
  timeSlots?: TimeSlot[];
  onEditSlot?: (slot: TimeSlot) => void;
  onRefresh?: () => void;
  className?: string;
}

export function Calendar({
  currentWeek,
  lessons = [],
  timeSlots = [],
  onEditSlot,
  onRefresh,
  className,
}: CalendarViewProps) {
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentWeek);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentWeek]);

  const timeSlotsByDay = useMemo(() => {
    const slots = new Map<string, TimeSlot[]>();
    weekDays.forEach(day => {
      slots.set(format(day, 'yyyy-MM-dd'), []);
    });

    timeSlots.forEach(slot => {
      const day = format(new Date(slot.startTime), 'yyyy-MM-dd');
      if (slots.has(day)) {
        slots.get(day)?.push(slot);
      }
    });

    return slots;
  }, [weekDays, timeSlots]);

  const lessonsByDay = useMemo(() => {
    const dayLessons = new Map<string, Lesson[]>();
    weekDays.forEach(day => {
      dayLessons.set(format(day, 'yyyy-MM-dd'), []);
    });

    lessons.forEach(lesson => {
      const day = format(new Date(lesson.startTime), 'yyyy-MM-dd');
      if (dayLessons.has(day)) {
        dayLessons.get(day)?.push(lesson);
      }
    });

    return dayLessons;
  }, [weekDays, lessons]);

  return (
    <Card className={cn('p-4', className)}>
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map(day => (
          <div key={day.toISOString()} className="text-center">
            <div className="mb-2 font-medium">{format(day, 'EEE')}</div>
            <div className="rounded-lg bg-accent/50 p-2">
              <div className="mb-2 text-sm text-muted-foreground">
                {format(day, 'MMM d')}
              </div>
              <div className="space-y-1">
                {timeSlotsByDay.get(format(day, 'yyyy-MM-dd'))?.map((slot: TimeSlot) => (
                  <div
                    key={slot.id}
                    className="cursor-pointer rounded bg-accent p-1 text-xs"
                    onClick={() => onEditSlot?.(slot)}
                  >
                    {format(new Date(slot.startTime), 'h:mm a')}
                  </div>
                ))}
                {lessonsByDay.get(format(day, 'yyyy-MM-dd'))?.map((lesson: Lesson) => (
                  <div
                    key={lesson.id}
                    className="rounded bg-primary p-1 text-xs text-primary-foreground"
                  >
                    {format(new Date(lesson.startTime), 'h:mm a')} -{' '}
                    {lesson.student.user.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}