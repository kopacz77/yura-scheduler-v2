import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    // Get time slots
    const timeSlots = await prisma.rinkTimeSlot.findMany({
      where: {
        rinkId: rinkId || undefined,
        isActive: true,
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
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        rink: true,
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