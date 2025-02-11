import { prisma } from '@/lib/db';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

export async function getResourceAvailability(
  resourceId: string,
  startDate: string,
  endDate: string
) {
  // Parse dates
  const start = startOfDay(parseISO(startDate));
  const end = endOfDay(parseISO(endDate));

  // Get existing appointments
  const existingLessons = await prisma.lesson.findMany({
    where: {
      rinkId: resourceId,
      startTime: {
        gte: start,
        lte: end,
      },
    },
  });

  // Get time slots
  const timeSlots = await prisma.rinkTimeSlot.findMany({
    where: {
      rinkId: resourceId,
      startTime: {
        gte: start,
        lte: end,
      },
      isActive: true,
    },
  });

  return {
    resourceId,
    startDate: start,
    endDate: end,
    existingLessons,
    availableSlots: timeSlots,
  };
}