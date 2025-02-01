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
    orderBy: {
      name: 'asc',
    },
  });

  return rinks;
}

export async function getRink(id: string) {
  'use server';

  const rink = await prisma.rink.findUnique({
    where: { id },
    include: {
      timeSlots: {
        where: {
          isActive: true,
        },
        orderBy: [
          {
            startTime: 'asc',
          },
          {
            daysOfWeek: 'asc',
          },
        ],
      },
    },
  });

  return rink;
}

interface RinkFormData {
  name: string;
  address: string;
  timezone: string;
  maxCapacity?: number;
}

export async function createRink(data: RinkFormData) {
  'use server';

  const rink = await prisma.rink.create({
    data: {
      name: data.name,
      address: data.address,
      timezone: data.timezone,
      maxCapacity: data.maxCapacity,
    },
  });

  return rink;
}

export async function updateRink(id: string, data: Partial<RinkFormData>) {
  'use server';

  const rink = await prisma.rink.update({
    where: { id },
    data,
  });

  return rink;
}

export async function deleteRink(id: string) {
  'use server';

  // First, soft-delete all time slots
  await prisma.rinkTimeSlot.updateMany({
    where: { rinkId: id },
    data: { isActive: false }
  });

  // Then delete the rink
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
}

export async function getRinkSchedule(rinkId: string): Promise<TimeSlot[]> {
  'use server';

  const timeSlots = await prisma.rinkTimeSlot.findMany({
    where: {
      rinkId,
      isActive: true,
    },
    orderBy: [
      {
        startTime: 'asc',
      },
      {
        daysOfWeek: 'asc',
      },
    ],
  });

  return timeSlots;
}

export async function addTimeSlot(
  rinkId: string,
  data: Omit<TimeSlot, 'id'>
) {
  'use server';

  // Check for overlapping time slots on the same days
  const overlappingSlots = await prisma.rinkTimeSlot.findMany({
    where: {
      rinkId,
      isActive: true,
      startTime: {
        lte: data.endTime,
      },
      endTime: {
        gte: data.startTime,
      },
      daysOfWeek: {
        hasSome: data.daysOfWeek,
      },
    },
  });

  if (overlappingSlots.length > 0) {
    throw new Error('Time slot overlaps with existing slots');
  }

  const timeSlot = await prisma.rinkTimeSlot.create({
    data: {
      rinkId,
      startTime: data.startTime,
      endTime: data.endTime,
      maxStudents: data.maxStudents,
      daysOfWeek: data.daysOfWeek,
    },
  });

  return timeSlot;
}

export async function updateTimeSlot(
  id: string,
  data: Partial<Omit<TimeSlot, 'id'>>
) {
  'use server';

  const timeSlot = await prisma.rinkTimeSlot.update({
    where: { id },
    data,
  });

  return timeSlot;
}

export async function deleteTimeSlot(id: string) {
  'use server';

  // Soft delete the time slot
  await prisma.rinkTimeSlot.update({
    where: { id },
    data: { isActive: false },
  });
}

// Helper function to check rink availability
export async function checkRinkAvailability(rinkId: string, date: Date) {
  'use server';

  const dayOfWeek = date.getDay();
  const timeStr = date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });

  const availableSlots = await prisma.rinkTimeSlot.findMany({
    where: {
      rinkId,
      isActive: true,
      daysOfWeek: {
        has: dayOfWeek,
      },
      startTime: {
        lte: timeStr,
      },
      endTime: {
        gte: timeStr,
      },
    },
    include: {
      lessons: {
        where: {
          startTime: {
            equals: date,
          },
        },
      },
    },
  });

  return availableSlots.map(slot => ({
    id: slot.id,
    startTime: slot.startTime,
    endTime: slot.endTime,
    maxStudents: slot.maxStudents,
    currentStudents: slot.lessons.length,
    available: slot.lessons.length < slot.maxStudents,
  }));
}
