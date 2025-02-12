import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const appointmentId = params.id;
    const lesson = await prisma.lesson.findUnique({
      where: { id: appointmentId },
      include: {
        student: true,
      },
    });

    if (!lesson) {
      return new NextResponse('Appointment not found', { status: 404 });
    }

    // Check authorization
    if (
      session.user.role !== 'ADMIN' &&
      lesson.student.userId !== session.user.id
    ) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Update the lesson status
    const updatedLesson = await prisma.lesson.update({
      where: { id: appointmentId },
      data: {
        status: 'CANCELLED',
        cancellationTime: new Date(),
      },
    });

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
