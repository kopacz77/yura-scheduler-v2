import { prisma } from '@/lib/prisma';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

export async function checkWeeklyLessonLimit(
  studentId: string,
  date: Date
): Promise<boolean> {
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);

  // Get student's max lessons per week
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { maxLessonsPerWeek: true },
  });

  if (!student) {
    throw new Error('Student not found');
  }

  // Count lessons in the same week
  const weeklyLessonsCount = await prisma.lesson.count({
    where: {
      studentId,
      startTime: {
        gte: weekStart,
        lte: weekEnd,
      },
      status: {
        not: 'CANCELLED',
      },
    },
  });

  return weeklyLessonsCount < student.maxLessonsPerWeek;
}

export function formatTimeSlot(date: Date, timeString: string, timezone: string) {
  // Parse the time string (format: "HH:mm")
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Create a new date with the same day but different time
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  
  // Convert to the specified timezone
  return zonedTimeToUtc(newDate, timezone);
}

export function formatLessonTime(date: Date) {
  return format(date, 'h:mm a');
}
