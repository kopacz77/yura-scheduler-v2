import { parseISO, isWithinInterval, format } from 'date-fns';
import { getLocalDateTime } from './date';
import type { TimeSlot, LessonWithRelations } from '@/types/schedule';

export function formatScheduleTime(date: Date | string) {
  const localDate = getLocalDateTime(date);
  return format(localDate, 'h:mm a');
}

export function formatScheduleDate(date: Date | string) {
  const localDate = getLocalDateTime(date);
  return format(localDate, 'EEEE, MMMM d');
}

export function isTimeSlotAvailable(slot: TimeSlot, lessons: LessonWithRelations[]) {
  const slotStart = parseISO(slot.startTime);
  const slotEnd = parseISO(slot.endTime);

  const conflictingLessons = lessons.filter(lesson => {
    const lessonStart = new Date(lesson.startTime);
    const lessonEnd = new Date(lesson.endTime);

    return isWithinInterval(slotStart, { start: lessonStart, end: lessonEnd }) ||
           isWithinInterval(slotEnd, { start: lessonStart, end: lessonEnd });
  });

  return conflictingLessons.length < slot.maxStudents;
}
