import { prisma } from '@/lib/prisma';
import { startOfWeek, endOfWeek, format } from 'date-fns';

export interface TimeSlot {
  id: string;
  startTime: string;  // Time in HH:mm format
  endTime: string;    // Time in HH:mm format
  maxStudents: number;
}

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
        orderBy: {
          startTime: 'asc',
        },
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

export async function getRinkSchedule(rinkId: string): Promise<TimeSlot[]> {
  'use server';

  const timeSlots = await prisma.rinkTimeSlot.findMany({
    where: {
      rinkId,
      isActive: true,
    },
    orderBy: {
      startTime: 'asc',
    },
  });

  // Transform the data to match the TimeSlot interface
  return timeSlots.map(slot => ({
    id: slot.id,
    startTime: format(slot.startTime, 'HH:mm'),
    endTime: format(slot.endTime, 'HH:mm'),
    maxStudents: slot.maxStudents
  }));
}

export async function addTimeSlot(
  rinkId: string,
  data: Omit<TimeSlot, 'id'>
) {
  'use server';

  // Convert time strings to full Date objects
  const startDate = new Date(`2000-01-01T${data.startTime}:00`);
  const endDate = new Date(`2000-01-01T${data.endTime}:00`);

  // Check for overlapping time slots
  const overlappingSlots = await prisma.rinkTimeSlot.findMany({
    where: {
      rinkId,
      isActive: true,
      startTime: {
        lte: endDate,
      },
      endTime: {
        gte: startDate,
      },
    },
  });

  if (overlappingSlots.length > 0) {
    throw new Error('Time slot overlaps with existing slots');
  }

  const timeSlot = await prisma.rinkTimeSlot.create({
    data: {
      rinkId,
      startTime: startDate,
      endTime: endDate,
      maxStudents: data.maxStudents,
    },
  });

  // Transform to match TimeSlot interface
  return {
    id: timeSlot.id,
    startTime: format(timeSlot.startTime, 'HH:mm'),
    endTime: format(timeSlot.endTime, 'HH:mm'),
    maxStudents: timeSlot.maxStudents
  };
}

export async function updateTimeSlot(
  id: string,
  data: Partial<Omit<TimeSlot, 'id'>>
) {
  'use server';

  const updates: any = {};
  
  if (data.startTime) {
    updates.startTime = new Date(`2000-01-01T${data.startTime}:00`);
  }
  if (data.endTime) {
    updates.endTime = new Date(`2000-01-01T${data.endTime}:00`);
  }
  if (data.maxStudents) {
    updates.maxStudents = data.maxStudents;
  }

  const timeSlot = await prisma.rinkTimeSlot.update({
    where: { id },
    data: updates,
  });

  // Transform to match TimeSlot interface
  return {
    id: timeSlot.id,
    startTime: format(timeSlot.startTime, 'HH:mm'),
    endTime: format(timeSlot.endTime, 'HH:mm'),
    maxStudents: timeSlot.maxStudents
  };
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

  const timeStr = format(date, 'HH:mm');

  const availableSlots = await prisma.rinkTimeSlot.findMany({
    where: {
      rinkId,
      isActive: true,
      startTime: {
        lte: date,
      },
      endTime: {
        gte: date,
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
    startTime: format(slot.startTime, 'HH:mm'),
    endTime: format(slot.endTime, 'HH:mm'),
    maxStudents: slot.maxStudents,
    currentStudents: slot.lessons.length,
    available: slot.lessons.length < slot.maxStudents,
  }));
}
