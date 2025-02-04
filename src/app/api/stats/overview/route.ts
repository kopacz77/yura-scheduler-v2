import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { startOfWeek, endOfWeek } from 'date-fns';

export async function GET() {
  try {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);

    const [totalStudents, weeklyLessons, totalRevenue] = await Promise.all([
      prisma.student.count(),
      prisma.lesson.count({
        where: {
          startTime: {
            gte: weekStart,
            lte: weekEnd
          }
        }
      }),
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED'
        },
        _sum: {
          amount: true
        }
      })
    ]);

    return NextResponse.json({
      totalStudents,
      weeklyLessons,
      totalRevenue: totalRevenue._sum.amount || 0
    });
  } catch (error) {
    console.error('Error getting stats overview:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}