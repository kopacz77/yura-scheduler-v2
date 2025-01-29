import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { SkatingLevel } from '@prisma/client';

export async function GET() {
  try {
    const studentsPerLevel = await Promise.all(
      Object.values(SkatingLevel).map(async (level) => {
        const count = await db.query.student.count({
          where: { level },
        });

        const colors = {
          BEGINNER: '#22c55e',
          INTERMEDIATE: '#3b82f6',
          ADVANCED: '#a855f7',
          COMPETITIVE: '#ef4444',
        };

        return {
          name: level.charAt(0) + level.slice(1).toLowerCase(),
          value: count,
          color: colors[level],
        };
      })
    );

    return NextResponse.json(studentsPerLevel);
  } catch (error) {
    console.error('Error fetching student distribution:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
