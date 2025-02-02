import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkWeeklyLessonLimit } from '@/lib/schedule-utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { startOfWeek, endOfWeek } from 'date-fns';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Allow access for now during development/testing
    // if (!session) {
    //   return new NextResponse('Unauthorized', { status: 401 });
    // }

    const body = await req.json();
    const { studentId, rinkId, startTime, endTime, price } = body;

    if (!studentId || !rinkId || !startTime || !endTime || !price) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // Check if student has reached their weekly lesson limit
    const canBookLesson = await checkWeeklyLessonLimit(studentId, startDate);
    if (!canBookLesson) {
      return new NextResponse('Weekly lesson limit reached', { status: 400 });
    }

    // Create the lesson
    const lesson = await prisma.lesson.create({
      data: {
        studentId,
        rinkId,
        startTime: startDate,
        endTime: endDate,
        duration: Math.round((endDate.getTime() - startDate.getTime()) / 1000 / 60),
        price,
        payment: {
          create: {
            studentId,
            amount: price,
            method: 'VENMO',
            referenceCode: `PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          },
        },
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        rink: true,
        payment: true,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('[LESSONS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Allow access for now during development/testing
    // if (!session) {
    //   return new NextResponse('Unauthorized', { status: 401 });
    // }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return new NextResponse('Missing date range', { status: 400 });
    }

    const lessons = await prisma.lesson.findMany({
      where: {
        startTime: {
          gte: new Date(startDate),
          lte: new Date(endDate),
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

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('[LESSONS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
