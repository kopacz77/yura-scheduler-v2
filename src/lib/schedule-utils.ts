import { prisma } from '@/lib/prisma';
import { startOfWeek, endOfWeek } from 'date-fns';

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
