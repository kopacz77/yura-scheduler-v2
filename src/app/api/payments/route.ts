import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { lessonId, amount, method, referenceCode, notes } = body;

    // Validate lesson exists and isn't already paid
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        payment: true,
        student: true,
      },
    });

    if (!lesson) {
      return new NextResponse('Lesson not found', { status: 404 });
    }

    if (lesson.payment) {
      return new NextResponse('Payment already exists for this lesson', {
        status: 400,
      });
    }

    // Check for duplicate reference code
    const existingPayment = await prisma.payment.findUnique({
      where: { referenceCode },
    });

    if (existingPayment) {
      return new NextResponse('Reference code already used', {
        status: 400,
      });
    }

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        lessonId,
        studentId: lesson.student.id,
        amount: Number(amount),
        method,
        referenceCode,
        notes,
        status: 'COMPLETED',
        verifiedBy: session.user.id,
        verifiedAt: new Date(),
      },
    });

    // Send payment confirmation email (implement this later)
    // await sendPaymentConfirmation(payment, lesson);

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error processing payment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const status = searchParams.get('status');

    const filters: any = {};

    if (session.user.role === 'STUDENT') {
      filters.studentId = session.user.id;
    } else if (studentId) {
      filters.studentId = studentId;
    }

    if (status) {
      filters.status = status;
    }

    const payments = await prisma.payment.findMany({
      where: filters,
      include: {
        lesson: {
          include: {
            rink: true,
          },
        },
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
