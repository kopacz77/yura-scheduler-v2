import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

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
          orderBy: { startTime: 'desc' },
          take: 10
        }
      }
    });

    if (!student) {
      return new NextResponse('Student not found', { status: 404 });
    }

    const completedLessons = await prisma.lesson.count({
      where: {
        studentId: student.id,
        status: 'COMPLETED'
      }
    });

    const totalPayments = await prisma.payment.aggregate({
      where: {
        studentId: student.id,
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      }
    });

    return NextResponse.json({
      level: student.level,
      completedLessons,
      totalSpent: totalPayments._sum.amount || 0,
      recentLessons: student.lessons
    });
  } catch (error) {
    console.error('Error fetching student progress:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
