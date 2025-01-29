import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get student ID from the authenticated user
    const student = await prisma.student.findUnique({
      where: { userId: session.user.id }
    });

    if (!student) {
      return new NextResponse('Student not found', { status: 404 });
    }

    // Get all completed appointments with notes for progress tracking
    const completedLessons = await prisma.appointment.findMany({
      where: {
        studentId: student.id,
        end: {
          lte: new Date()
        }
      },
      orderBy: {
        start: 'desc'
      },
      include: {
        resource: true
      }
    });

    // Calculate progress metrics
    const progress = {
      totalLessons: completedLessons.length,
      lessonsByType: completedLessons.reduce((acc: any, lesson) => {
        acc[lesson.lessonType] = (acc[lesson.lessonType] || 0) + 1;
        return acc;
      }, {}),
      recentNotes: completedLessons.slice(0, 5).map(lesson => ({
        date: lesson.start,
        notes: lesson.notes,
        lessonType: lesson.lessonType
      })),
      currentLevel: student.level,
      // Add more metrics as needed
    };

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching student progress:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
