import { prisma } from '@/lib/prisma';

interface RecurringPatternFormData {
  rinkId: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  duration: number;
  maxStudents: number;
  daysOfWeek: number[];
}

export async function createRecurringPattern(data: RecurringPatternFormData) {
  'use server';

  const pattern = await prisma.recurringPattern.create({
    data: {
      rinkId: data.rinkId,
      startDate: data.startDate,
      endDate: data.endDate,
      startTime: data.startTime,
      duration: data.duration,
      maxStudents: data.maxStudents,
      daysOfWeek: data.daysOfWeek,
      isActive: true,
    },
  });

  return pattern;
}

export async function updateRecurringPattern(
  id: string,
  data: Partial<RecurringPatternFormData>
) {
  'use server';

  const pattern = await prisma.recurringPattern.update({
    where: { id },
    data,
  });

  return pattern;
}

export async function deleteRecurringPattern(id: string) {
  'use server';

  // Soft delete by marking as inactive
  await prisma.recurringPattern.update({
    where: { id },
    data: { isActive: false },
  });
}

export async function getRecurringPatterns(rinkId: string) {
  'use server';

  const patterns = await prisma.recurringPattern.findMany({
    where: {
      rinkId,
      isActive: true,
    },
    orderBy: {
      startDate: 'asc',
    },
  });

  return patterns;
}
