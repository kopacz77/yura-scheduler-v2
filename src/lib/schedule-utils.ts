import { prisma } from '@/lib/prisma';
import { startOfWeek, endOfWeek, format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

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
  
  // Format the date with the correct timezone and time
  return formatInTimeZone(
    new Date(date.setHours(hours, minutes, 0, 0)),
    timezone,
    'yyyy-MM-dd\'T\'HH:mm:ssXXX'
  );
}

export function formatLessonTime(date: Date) {
  return format(date, 'h:mm a');
}

export function getTimeSlots(date: Date, slots: any[]) {
  const dayOfWeek = date.getDay();
  const timeStr = format(date, 'HH:mm');

  return slots.filter(slot => 
    slot.daysOfWeek.includes(dayOfWeek) &&
    slot.startTime <= timeStr &&
    slot.endTime > timeStr
  );
}
