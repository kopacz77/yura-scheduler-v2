import { addMinutes, isWithinInterval, format } from 'date-fns';
import prisma from '@/lib/prisma';
import { Lesson, Rink, RinkTimeSlot } from '@prisma/client';

export interface ResourceAvailability {
  resource: Rink;
  timeSlots: RinkTimeSlot[];
  currentLessons: Lesson[];
}

export async function getResourceAvailability(
  startDate: Date,
  endDate: Date,
  duration: number = 60
): Promise<ResourceAvailability[]> {
  // First, get all rinks
  const rinks = await prisma.rink.findMany();

  // Get time slots with their active status
  const timeSlots = await prisma.rinkTimeSlot.findMany({
    where: {
      isActive: true,
      rinkId: { in: rinks.map(rink => rink.id) }
    }
  });

  // Get lessons within the date range
  const lessons = await prisma.lesson.findMany({
    where: {
      startTime: { gte: startDate },
      endTime: { lte: endDate },
      rinkId: { in: rinks.map(rink => rink.id) },
      status: { not: 'CANCELLED' }
    }
  });

  // Build availability map
  return rinks.map(rink => ({
    resource: rink,
    timeSlots: timeSlots.filter(slot => slot.rinkId === rink.id),
    currentLessons: lessons.filter(lesson => lesson.rinkId === rink.id)
  }));
}

export function isSlotAvailable(
  slot: RinkTimeSlot,
  date: Date,
  lessons: Lesson[],
  duration: number = 60
): boolean {
  const slotStartTime = new Date(slot.startTime);
  const slotEndTime = new Date(slot.endTime);

  // Create a new date object for the target date with the time from the slot
  const slotStart = new Date(date);
  slotStart.setHours(
    slotStartTime.getHours(),
    slotStartTime.getMinutes(),
    0,
    0
  );

  const slotEnd = new Date(date);
  slotEnd.setHours(
    slotEndTime.getHours(),
    slotEndTime.getMinutes(),
    0,
    0
  );

  // Check if the day of week matches
  const currentDayOfWeek = date.getDay();
  const slotDayOfWeek = slotStartTime.getDay();
  if (currentDayOfWeek !== slotDayOfWeek) {
    return false;
  }

  // Check if we have space in this time slot
  const lessonsInSlot = lessons.filter(lesson =>
    isWithinInterval(new Date(lesson.startTime), {
      start: slotStart,
      end: slotEnd
    })
  );

  if (lessonsInSlot.length >= slot.maxStudents) {
    return false;
  }

  // Check for overlaps with existing lessons
  const proposedEnd = addMinutes(date, duration);
  return !lessons.some(lesson =>
    isWithinInterval(date, {
      start: new Date(lesson.startTime),
      end: new Date(lesson.endTime)
    }) ||
    isWithinInterval(proposedEnd, {
      start: new Date(lesson.startTime),
      end: new Date(lesson.endTime)
    })
  );
}
