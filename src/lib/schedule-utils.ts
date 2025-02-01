import { Lesson, Student } from '@/types/schedule';
import { startOfWeek, endOfWeek, isWithin, addMinutes } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

export function calculateAvailableSlots(
  date: Date,
  rinkTimezone: string,
  existingLessons: Lesson[],
  duration: 30 | 60
): Date[] {
  // Convert local date to rink's timezone
  const rinkDate = utcToZonedTime(date, rinkTimezone);
  
  // Default business hours: 6 AM to 10 PM
  const startHour = 6;
  const endHour = 22;
  
  // Generate all possible time slots
  const slots: Date[] = [];
  let currentTime = new Date(rinkDate);
  currentTime.setHours(startHour, 0, 0, 0);
  
  while (currentTime.getHours() < endHour) {
    slots.push(new Date(currentTime));
    currentTime = addMinutes(currentTime, duration);
  }
  
  // Filter out slots that conflict with existing lessons
  return slots.filter(slot => {
    const slotEnd = addMinutes(slot, duration);
    return !existingLessons.some(lesson => {
      const lessonStart = new Date(lesson.startTime);
      const lessonEnd = new Date(lesson.endTime);
      return (
        (slot >= lessonStart && slot < lessonEnd) ||
        (slotEnd > lessonStart && slotEnd <= lessonEnd)
      );
    });
  });
}

export function checkWeeklyLessonLimit(
  student: Student,
  date: Date,
  existingLessons: Lesson[]
): boolean {
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);
  
  const lessonsThisWeek = existingLessons.filter(lesson => {
    const lessonDate = new Date(lesson.startTime);
    return (
      lesson.studentId === student.id &&
      lessonDate >= weekStart &&
      lessonDate <= weekEnd
    );
  });
  
  return lessonsThisWeek.length < student.maxLessonsPerWeek;
}

export function calculateCancellationFee(
  lesson: Lesson,
  cancellationTime: Date,
  lessonPrice: number
): number {
  const lessonStart = new Date(lesson.startTime);
  const hoursDifference = 
    (lessonStart.getTime() - cancellationTime.getTime()) / (1000 * 60 * 60);
  
  if (hoursDifference < 24) {
    return lessonPrice * 0.5; // 50% fee for cancellations within 24 hours
  }
  
  return 0; // No fee for cancellations with more than 24 hours notice
}
