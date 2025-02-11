'use client';

import { useMemo } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { TimeSlot, LessonWithRelations } from '@/types/schedule';
import { StudentWithUser } from '@/types/student';

interface CalendarProps {
  currentWeek: Date;
  lessons: Array<LessonWithRelations & { student: StudentWithUser }>;
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
  className,
}: CalendarProps) {
  // ... rest of implementation
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
                {lessonsByDay.get(format(day, 'yyyy-MM-dd'))?.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="rounded bg-primary p-1 text-xs text-primary-foreground"
                  >
                    {format(new Date(lesson.startTime), 'h:mm a')} -{' '}
                    {lesson.student.user.name || 'Unnamed Student'}
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