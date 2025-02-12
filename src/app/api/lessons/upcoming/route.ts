import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LessonStatus } from '@prisma/client';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const query = {
      where: {
        ...(session.user.role === 'STUDENT' && {
          student: {
            userId: session.user.id
          }
        }),
        startTime: {
          gte: today,
          lt: nextWeek
        },
        status: {
          not: LessonStatus.CANCELLED
        }
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
        startTime: 'asc'
      },
      take: 10
    };

    const lessons = await prisma.lesson.findMany(query);
    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching upcoming lessons:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}