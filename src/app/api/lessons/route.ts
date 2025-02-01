import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkWeeklyLessonLimit } from '@/lib/schedule-utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { startOfWeek, endOfWeek } from 'date-fns';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { studentId, rinkId, startTime, duration } = data;

    // Calculate end time
    const endTime = new Date(new Date(startTime).getTime() + duration * 60000);

    // Get student details
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Check weekly lesson limit
    const existingLessons = await prisma.lesson.findMany({
      where: {
        studentId,
        status: 'scheduled',
      },
    });

    if (!checkWeeklyLessonLimit(student, new Date(startTime), existingLessons)) {
      return NextResponse.json(
        { error: 'Weekly lesson limit exceeded' },
        { status: 400 }
      );
    }

    // Check for scheduling conflicts
    const conflictingLesson = await prisma.lesson.findFirst({
      where: {
        rinkId,
        status: 'scheduled',
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
        ],
      },
    });

    if (conflictingLesson) {
      return NextResponse.json(
        { error: 'Time slot is already booked' },
        { status: 409 }
      );
    }

    // Create the lesson
    const lesson = await prisma.lesson.create({
      data: {
        studentId,
        rinkId,
        startTime,
        endTime,
        duration,
      },
      include: {
        student: {
          include: {
            user: true
          }
        },
        rink: true
      }
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error scheduling lesson:', error);
    return NextResponse.json(
      { error: 'Error scheduling lesson' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const rinkId = searchParams.get('rinkId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // If no dates provided, default to current week
    const start = startDate ? new Date(startDate) : startOfWeek(new Date());
    const end = endDate ? new Date(endDate) : endOfWeek(new Date());

    const where = {
      startTime: {
        gte: start,
        lte: end,
      },
      ...(rinkId && { rinkId }),
    };

    const lessons = await prisma.lesson.findMany({
      where,
      include: {
        student: {
          include: {
            user: true
          }
        },
        rink: true
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Error fetching lessons' },
      { status: 500 }
    );
  }
}
