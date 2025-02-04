import { prisma } from '@/lib/prisma';
import { Lesson } from '@prisma/client';

export async function checkResourceAvailability(
  resourceId: string,
  startTime: Date,
  endTime: Date
): Promise<boolean> {
  const overlappingLessons = await prisma.lesson.findMany({
    where: {
      rinkId: resourceId,
      startTime: { lte: endTime },
      endTime: { gte: startTime },
      status: 'SCHEDULED',
    },
  });

  return overlappingLessons.length === 0;
}