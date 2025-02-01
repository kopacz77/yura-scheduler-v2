import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { EmailService } from '@/lib/email/service';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { referenceCode } = await req.json();

    if (!referenceCode) {
      return NextResponse.json(
        { error: 'Reference code is required' },
        { status: 400 }
      );
    }

    // Find the payment with the reference code
    const payment = await prisma.payment.findUnique({
      where: { referenceCode },
      include: {
        lesson: {
          include: {
            student: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (payment.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Payment already processed' },
        { status: 400 }
      );
    }

    // Update the payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'COMPLETED',
        verifiedBy: session.user?.email || 'system',
        verifiedAt: new Date(),
      },
      include: {
        lesson: {
          include: {
            student: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    // If the lesson is starting soon (within 24 hours), send a reminder
    const lessonStart = new Date(payment.lesson.startTime);
    const now = new Date();
    const hoursUntilLesson = (lessonStart.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilLesson <= 24 && hoursUntilLesson > 0) {
      await EmailService.sendLessonReminder({
        lesson: payment.lesson,
        student: payment.lesson.student,
        price: payment.amount,
        isPaid: true
      });
    }

    return NextResponse.json({
      success: true,
      payment: updatedPayment
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
