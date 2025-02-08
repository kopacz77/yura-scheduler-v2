import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { startOfWeek, endOfWeek, isSameDay, parseISO, isWithinInterval } from 'date-fns';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const rinkId = searchParams.get('rinkId');

    if (!startDate || !endDate) {
      return new NextResponse('Start and end dates are required', { status: 400 });
    }

    // Parse the date range
    const start = startOfWeek(parseISO(startDate));
    const end = endOfWeek(parseISO(endDate));

    // Get available time slots
    const timeSlots = await prisma.rinkTimeSlot.findMany({
      where: {
        rinkId: rinkId || undefined,
        isActive: true,
        startTime: {
          gte: start,
          lte: end
        }
      },
      include: {
        rink: true,
      },
    });

    // Get booked lessons
    const lessons = await prisma.lesson.findMany({
      where: {
        rinkId: rinkId || undefined,
        startTime: {
          gte: start,
          lte: end,
        },
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        rink: true,
        timeSlot: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json({
      timeSlots,
      lessons,
    });
  } catch (error) {
    console.error('[SCHEDULE_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}