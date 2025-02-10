import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, addDays } from 'date-fns';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const today = new Date();
    const endDate = addDays(today, 7); // Get lessons for the next 7 days

    let lessons;
    if (session.user.role === 'ADMIN') {
      lessons = await prisma.lesson.findMany({
        where: {
          startTime: {
            gte: startOfDay(today),
            lte: endOfDay(endDate),
          },
          status: 'SCHEDULED',
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          rink: true,
        },
        orderBy: {
          startTime: 'asc',
        },
        take: 5,
      });
    } else {
      // For students, only show their own lessons
      const student = await prisma.student.findFirst({
        where: {
          userId: session.user.id,
        },
      });

      if (!student) {
        return new NextResponse('Student not found', { status: 404 });
      }

      lessons = await prisma.lesson.findMany({
        where: {
          studentId: student.id,
          startTime: {
            gte: startOfDay(today),
            lte: endOfDay(endDate),
          },
          status: 'SCHEDULED',
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          rink: true,
        },
        orderBy: {
          startTime: 'asc',
        },
        take: 5,
      });
    }

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching upcoming lessons:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}