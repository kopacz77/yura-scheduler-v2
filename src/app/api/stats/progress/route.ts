import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { startOfMonth, subMonths, format } from 'date-fns';
import { SkatingLevel } from '@prisma/client';

export async function GET() {
  try {
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      return {
        start: startOfMonth(date),
        label: format(date, 'MMM'),
      };
    }).reverse();

    const progressData = await Promise.all(
      months.map(async ({ start, label }) => {
        const monthData = { month: label };

        for (const level of Object.values(SkatingLevel)) {
          const count = await db.query.student.count({
            where: {
              level,
              startDate: {
                lte: start,
              },
            },
          });

          monthData[level.toLowerCase()] = count;
        }

        return monthData;
      })
    );

    return NextResponse.json(progressData);
  } catch (error) {
    console.error('Error fetching progress data:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
