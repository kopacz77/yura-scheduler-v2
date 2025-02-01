import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { calculateCancellationFee } from '@/lib/schedule-utils';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reason } = await req.json();
    const lessonId = params.id;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        student: true,
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Calculate cancellation fee
    const cancellationTime = new Date();
    const cancellationFee = calculateCancellationFee(
      lesson,
      cancellationTime,
      100 // TODO: Replace with actual lesson price
    );

    // Update lesson status
    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        status: 'cancelled',
        cancellationReason: reason,
        cancellationTime,
      },
      include: {
        student: {
          include: {
            user: true
          }
        },
        rink: true
      }
    });

    return NextResponse.json({
      lesson: updatedLesson,
      cancellationFee,
    });
  } catch (error) {
    console.error('Error cancelling lesson:', error);
    return NextResponse.json(
      { error: 'Error cancelling lesson' },
      { status: 500 }
    );
  }
}
