import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LessonStatus, Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const query: Prisma.LessonFindManyArgs = {
      where: {
        startTime: {
          gte: now,
          lt: nextWeek
        },
        status: {
          not: LessonStatus.CANCELLED
        },
        ...(session.user.role === 'STUDENT' && {
          student: {
            userId: session.user.id
          }
        })
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        rink: true
      },
      orderBy: {
        startTime: 'asc' as const
      },
      take: 10
    };

    const lessons = await prisma.lesson.findMany(query);

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching upcoming lessons:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}