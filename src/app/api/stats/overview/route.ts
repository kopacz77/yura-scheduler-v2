import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { startOfWeek, endOfWeek } from 'date-fns';

export async function GET() {
  try {
    // Get start and end of current week
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());

    // Get total students count
    const totalStudents = await db.query.student.count();

    // Get this week's lessons
    const weeklyLessons = await db.query.appointment.count({
      where: {
        start: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });

    // Get total unpaid amount
    const unpaidPayments = await db.query.payment.findMany({
      where: {
        status: 'PENDING',
      },
      select: {
        amount: true,
      },
    });

    const outstandingAmount = unpaidPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    // Calculate overall progress (example metric)
    const studentsWithProgress = await db.query.student.findMany({
      select: {
        level: true,
      },
    });

    const progressScore = studentsWithProgress.reduce((score, student) => {
      const levelScores = {
        'BEGINNER': 0.25,
        'INTERMEDIATE': 0.5,
        'ADVANCED': 0.75,
        'COMPETITIVE': 1,
      };
      return score + levelScores[student.level];
    }, 0);

    const averageProgress = totalStudents > 0
      ? Math.round((progressScore / totalStudents) * 100)
      : 0;

    return NextResponse.json({
      totalStudents,
      weeklyLessons,
      outstandingAmount,
      averageProgress,
    });
  } catch (error) {
    console.error('Error fetching overview stats:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
