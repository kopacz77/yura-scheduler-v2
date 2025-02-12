import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { parse, addDays, eachDayOfInterval, isEqual, isBefore, isAfter, parseISO, format } from 'date-fns';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const {
      rinkId,
      startDate,
      endDate,
      startTime,
      duration,
      maxStudents,
      daysOfWeek,
    } = body;

    // Validate rink exists
    const rink = await prisma.rink.findUnique({
      where: { id: rinkId },
    });

    if (!rink) {
      return new NextResponse('Rink not found', { status: 404 });
    }

    const startDateTime = parse(startTime, 'HH:mm', new Date());
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

    // Generate dates between start and end date
    const dateRange = eachDayOfInterval({
      start: parseISO(startDate),
      end: parseISO(endDate),
    });

    // Filter dates to only include selected days of week
    const validDates = dateRange.filter(date =>
      daysOfWeek.includes(date.getDay())
    );

    // Create time slots for each valid date
    const timeSlots = validDates.map(date => {
      const slotStartTime = new Date(date);
      slotStartTime.setHours(startDateTime.getHours());
      slotStartTime.setMinutes(startDateTime.getMinutes());

      const slotEndTime = new Date(date);
      slotEndTime.setHours(endDateTime.getHours());
      slotEndTime.setMinutes(endDateTime.getMinutes());

      return {
        rinkId,
        startTime: slotStartTime,
        endTime: slotEndTime,
        maxStudents: Number(maxStudents),
        isActive: true,
      };
    });

    // Check for existing slots in the same time periods
    const existingSlots = await prisma.rinkTimeSlot.findMany({
      where: {
        rinkId,
        startTime: {
          gte: validDates[0],
          lte: validDates[validDates.length - 1],
        },
      },
    });

    // Filter out slots that overlap with existing ones
    const nonOverlappingSlots = timeSlots.filter(newSlot => {
      return !existingSlots.some(existingSlot => {
        const newStart = newSlot.startTime;
        const newEnd = newSlot.endTime;
        const existingStart = existingSlot.startTime;
        const existingEnd = existingSlot.endTime;

        return (
          (isEqual(newStart, existingStart) || isEqual(newEnd, existingEnd)) ||
          (isAfter(newStart, existingStart) && isBefore(newStart, existingEnd)) ||
          (isAfter(newEnd, existingStart) && isBefore(newEnd, existingEnd)) ||
          (isBefore(newStart, existingStart) && isAfter(newEnd, existingEnd))
        );
      });
    });

    // Create recurring pattern
    const pattern = await prisma.recurringPattern.create({
      data: {
        rinkId,
        daysOfWeek,
        startDate: parseISO(startDate),
        endDate: parseISO(endDate),
        startTime: format(startDateTime, 'HH:mm'),
        duration: Number(duration),
        maxStudents: Number(maxStudents),
        isActive: true,
      },
    });

    // Create the non-overlapping time slots
    const createdSlots = await prisma.rinkTimeSlot.createMany({
      data: nonOverlappingSlots.map(slot => ({
        ...slot,
        recurringId: pattern.id,
      })),
    });

    return NextResponse.json({
      pattern,
      slotsCreated: createdSlots.count,
      totalSlots: timeSlots.length,
    });
  } catch (error) {
    console.error('Error creating recurring slots:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
