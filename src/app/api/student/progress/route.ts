import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { userId: session.user.id },
      include: {
        lessons: {
          where: { status: 'COMPLETED' },
          orderBy: { startTime: 'desc' },
          take: 10
        }
      }
    });

    if (!student) {
      return new NextResponse('Student not found', { status: 404 });
    }

    return NextResponse.json({
      currentLevel: student.level,
      recentLessons: student.lessons
    });
  } catch (error) {
    console.error('Error fetching student progress:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}