'use client';

import { useState } from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/calendar/Calendar';
import { LessonWithRelations, TimeSlot } from '@/types/schedule';
import { StudentWithUser } from '@/types/student';

type EnhancedLesson = LessonWithRelations & { student: StudentWithUser };

interface CalendarViewProps {
  lessons: EnhancedLesson[];
  timeSlots?: TimeSlot[];
  onEditSlot?: (slot: TimeSlot) => void;
  className?: string;
  initialWeek?: Date;
}

export function CalendarView({
  lessons,
  timeSlots = [],
  onEditSlot,
  className,
  initialWeek = new Date()
}: CalendarViewProps) {
  const [currentWeek, setCurrentWeek] = useState(initialWeek);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          {format(startOfWeek(currentWeek), 'MMM d')} -{' '}
          {format(endOfWeek(currentWeek), 'MMM d, yyyy')}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCurrentWeek(curr => new Date(curr.getTime() - 7 * 24 * 60 * 60 * 1000))}
            variant="outline"
            size="sm"
          >
            Previous Week
          </Button>
          <Button
            onClick={() => setCurrentWeek(curr => new Date(curr.getTime() + 7 * 24 * 60 * 60 * 1000))}
            variant="outline"
            size="sm"
          >
            Next Week
          </Button>
        </div>
      </div>
      
      <Calendar
        currentWeek={currentWeek}
        lessons={lessons}
        timeSlots={timeSlots}
        onEditSlot={onEditSlot}
      />
    </div>
  );
}