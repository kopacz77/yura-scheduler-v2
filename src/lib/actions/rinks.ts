import { prisma } from '@/lib/prisma';
import { startOfWeek, endOfWeek } from 'date-fns';

export async function getRinks() {
  'use server';

  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);

  const rinks = await prisma.rink.findMany({
    include: {
      _count: {
        select: {
          lessons: {
            where: {
              startTime: {
                gte: weekStart,
                lte: weekEnd,
              },
            },
          },
        },
      },
      lessons: {
        where: {
          startTime: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
      },
    },
  });

  return rinks;
}

export async function createRink(data: {
  name: string;
  address: string;
  timezone: string;
}) {
  'use server';

  const rink = await prisma.rink.create({
    data,
  });

  return rink;
}

export async function updateRink(
  id: string,
  data: {
    name?: string;
    address?: string;
    timezone?: string;
  }
) {
  'use server';

  const rink = await prisma.rink.update({
    where: { id },
    data,
  });

  return rink;
}

export async function deleteRink(id: string) {
  'use server';

  await prisma.rink.delete({
    where: { id },
  });
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  maxStudents: number;
  daysOfWeek: number[];
  rinkId: string;
}

export async function getRinkSchedule(rinkId: string): Promise<TimeSlot[]> {
  'use server';

  // TODO: Implement schedule fetching from database
  return [];
}

export async function addTimeSlot(
  rinkId: string,
  data: Omit<TimeSlot, 'id' | 'rinkId'>
) {
  'use server';

  // TODO: Implement time slot creation in database
}

export async function deleteTimeSlot(id: string) {
  'use server';

  // TODO: Implement time slot deletion from database
}
