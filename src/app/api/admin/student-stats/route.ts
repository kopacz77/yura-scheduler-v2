import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { Level } from '@prisma/client';

export async function GET() {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Get student level distribution
    const students = await prisma.student.findMany({
      select: {
        level: true,
      },
    });

    // Count students by level
    const levels = students.reduce((acc, student) => {
      acc[student.level] = (acc[student.level] || 0) + 1;
      return acc;
    }, {} as Record<Level, number>);

    return NextResponse.json({
      levels,
      total: students.length,
    });
  } catch (error) {
    console.error('Error fetching student stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}