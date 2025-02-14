'use client';

import { useMemo, memo } from 'react';
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
  className?: string;
}

// Memoized time slot component for better performance
const TimeSlotItem = memo(({ slot, onEdit }: { slot: TimeSlot; onEdit?: (slot: TimeSlot) => void }) => (
  <div
    key={slot.id}
    className="cursor-pointer rounded bg-accent p-1 text-xs transition-colors hover:bg-accent/80"
    onClick={() => onEdit?.(slot)}
  >
    {format(new Date(slot.startTime), 'h:mm a')}
  </div>
));
TimeSlotItem.displayName = 'TimeSlotItem';

// Memoized lesson component
const LessonItem = memo(({ lesson }: { lesson: LessonWithRelations & { student: StudentWithUser } }) => (
  <div
    key={lesson.id}
    className="rounded bg-primary p-1 text-xs text-primary-foreground"
  >
    {format(new Date(lesson.startTime), 'h:mm a')} -{' '}
    {lesson.student.user.name || 'Unnamed Student'}
  </div>
));
LessonItem.displayName = 'LessonItem';

// Memoized day column component
const DayColumn = memo(({ 
  day, 
  slots, 
  dayLessons,
  onEditSlot 
}: { 
  day: Date; 
  slots: TimeSlot[];
  dayLessons: Array<LessonWithRelations & { student: StudentWithUser }>;
  onEditSlot?: (slot: TimeSlot) => void;
}) => (
  <div key={day.toISOString()} className="text-center">
    <div className="mb-2 font-medium">{format(day, 'EEE')}</div>
    <div className="rounded-lg bg-accent/50 p-2">
      <div className="mb-2 text-sm text-muted-foreground">
        {format(day, 'MMM d')}
      </div>
      <div className="space-y-1">
        {slots.map((slot) => (
          <TimeSlotItem key={slot.id} slot={slot} onEdit={onEditSlot} />
        ))}
        {dayLessons.map((lesson) => (
          <LessonItem key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  </div>
));
DayColumn.displayName = 'DayColumn';

export function Calendar({
  currentWeek,
  lessons = [],
  timeSlots = [],
  onEditSlot,
  className,
}: CalendarProps) {
  // Memoize week days calculation
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentWeek);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentWeek]);

  // Memoize time slots organization
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

  // Memoize lessons organization
  const lessonsByDay = useMemo(() => {
    const dayLessons = new Map<string, typeof lessons>();
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
          <DayColumn
            key={day.toISOString()}
            day={day}
            slots={timeSlotsByDay.get(format(day, 'yyyy-MM-dd')) || []}
            dayLessons={lessonsByDay.get(format(day, 'yyyy-MM-dd')) || []}
            onEditSlot={onEditSlot}
          />
        ))}
      </div>
    </Card>
  );
}
