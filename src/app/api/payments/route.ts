import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateReferenceCode } from '@/lib/email/templates';
import { EmailService } from '@/lib/email/service';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const studentId = searchParams.get('studentId');

    const where = {
      ...(status && { status }),
      ...(studentId && { studentId }),
    };

    const payments = await prisma.payment.findMany({
      where,
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        lesson: {
          select: {
            startTime: true,
            duration: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId, amount, method } = await req.json();

    // Get the lesson details
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        student: {
          include: {
            user: true
          }
        },
        rink: true
      }
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Check if payment already exists
    const existingPayment = await prisma.payment.findFirst({
      where: { lessonId }
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: 'Payment already exists for this lesson' },
        { status: 400 }
      );
    }

    // Generate reference code
    const referenceCode = generateReferenceCode(
      lesson.student.user.name,
      new Date(lesson.startTime)
    );

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        lessonId,
        studentId: lesson.studentId,
        amount,
        method,
        referenceCode,
        status: 'PENDING'
      },
      include: {
        student: {
          include: {
            user: true
          }
        },
        lesson: true
      }
    });

    // Send email notification
    await EmailService.sendBookingConfirmation({
      lesson,
      student: lesson.student,
      price: amount,
      paymentMethod: method.toLowerCase() as 'venmo' | 'zelle'
    });

    return NextResponse.json({ payment });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
