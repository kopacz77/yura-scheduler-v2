import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { startOfDay, addDays } from 'date-fns';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const today = startOfDay(new Date());
    const nextWeek = addDays(today, 7);

    const query = {
      where: {
        startTime: {
          gte: today,
          lt: nextWeek,
        },
        status: {
          not: 'CANCELLED',
        },
        ...(session.user.role === 'STUDENT' ? {
          student: {
            userId: session.user.id,
          },
        } : {}),
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        rink: true,
      },
      orderBy: {
        startTime: 'asc',
      },
      take: 10,
    };

    const lessons = await prisma.lesson.findMany(query);

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching upcoming lessons:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
