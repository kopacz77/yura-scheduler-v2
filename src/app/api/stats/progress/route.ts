import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { startOfMonth, subMonths, format } from 'date-fns';
import { Level } from '@prisma/client';

export async function GET() {
  try {
    const now = new Date();
    const monthsToTrack = 6;

    const progressData = await Promise.all(
      Array.from({ length: monthsToTrack }).map(async (_, index) => {
        const targetMonth = subMonths(now, index);
        const monthStart = startOfMonth(targetMonth);
        const nextMonthStart = startOfMonth(subMonths(targetMonth, -1));

        const levelProgressions = await prisma.student.groupBy({
          by: ['level'],
          where: {
            updatedAt: {
              gte: monthStart,
              lt: nextMonthStart
            }
          },
          _count: true
        });

        return {
          month: format(monthStart, 'MMM yyyy'),
          levelCounts: Object.values(Level).reduce((acc, level) => {
            acc[level] = levelProgressions.find(p => p.level === level)?._count || 0;
            return acc;
          }, {} as Record<Level, number>)
        };
      })
    );

    return NextResponse.json(progressData.reverse());
  } catch (error) {
    console.error('Error getting progress data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}