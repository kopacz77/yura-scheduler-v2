import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { Level } from '@prisma/client';

export async function GET() {
  try {
    const students = await prisma.student.groupBy({
      by: ['level'],
      _count: {
        level: true
      }
    });

    const distribution = Object.values(Level).map(level => ({
      level,
      count: students.find(s => s.level === level)?._count.level || 0
    }));

    return NextResponse.json(distribution);
  } catch (error) {
    console.error('Error getting level distribution:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}