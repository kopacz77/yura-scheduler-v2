import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isSameDay } from 'date-fns';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const rinkId = searchParams.get('rinkId');
    const date = searchParams.get('date');

    if (!rinkId || !date) {
      return new NextResponse('Missing required parameters', { status: 400 });
    }

    // Get rink with its time slots
    const rink = await prisma.rink.findUnique({
      where: { id: rinkId },
      include: {
        timeSlots: {
          where: {
            isActive: true,
          },
        },
      },
    });

    if (!rink) {
      return new NextResponse('Rink not found', { status: 404 });
    }

    // Get booked lessons for the date
    const requestedDate = new Date(date);
    const lessons = await prisma.lesson.findMany({
      where: {
        rinkId,
        startTime: {
          gte: new Date(requestedDate.setHours(0, 0, 0, 0)),
          lt: new Date(requestedDate.setHours(23, 59, 59, 999)),
        },
      },
    });

    // Filter time slots for the specific date
    const availableTimeSlots = rink.timeSlots.filter(slot => {
      const slotDate = new Date(slot.startTime);
      return slot.isActive && isSameDay(slotDate, new Date(date));
    });

    // Map slots with their booking status
    const slotsWithAvailability = availableTimeSlots.map(slot => {
      const matchingLesson = lessons.find(lesson =>
        isSameDay(new Date(lesson.startTime), new Date(slot.startTime)) &&
        new Date(lesson.startTime).getHours() === new Date(slot.startTime).getHours() &&
        new Date(lesson.startTime).getMinutes() === new Date(slot.startTime).getMinutes()
      );

      return {
        ...slot,
        isBooked: !!matchingLesson,
        lesson: matchingLesson || null,
      };
    });

    return NextResponse.json({
      rink,
      slots: slotsWithAvailability,
    });

  } catch (error) {
    console.error('[AVAILABILITY_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}