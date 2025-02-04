import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: { student: true },
    });

    if (!lesson) {
      return new NextResponse('Lesson not found', { status: 404 });
    }

    // Only allow admins or the student who owns the lesson to cancel
    if (session.user.role !== 'ADMIN' && lesson.studentId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const { reason } = await req.json();
    const cancellationTime = new Date();

    // Update lesson status
    const updatedLesson = await prisma.lesson.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED',
        cancellationReason: reason,
        cancellationTime,
      },
    });

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.error('Error cancelling lesson:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}