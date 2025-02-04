import prisma from '@/lib/prisma';

export type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
  maxStudents: number;
};

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

export function validateAppointments(appointments: any[]) {
  // Add validation logic
  return true;
}

export function generateRecurringAppointments(baseAppointment: any, recurrence: any) {
  // Add generation logic
  return [];
}
