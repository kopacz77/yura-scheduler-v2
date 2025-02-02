import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const status = searchParams.get('status');

    const payments = await prisma.payment.findMany({
      where: {
        studentId: studentId || undefined,
        status: (status as any) || undefined,
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        lesson: true,
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

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    const { id, status, verifiedBy } = data;

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        status,
        verifiedBy: verifiedBy || session.user.id,
        verifiedAt: status === 'COMPLETED' ? new Date() : null,
      },
      include: {
        student: true,
        lesson: true,
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error updating payment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST endpoint for creating payments (if needed separately from lesson creation)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    
    const payment = await prisma.payment.create({
      data: {
        studentId: data.studentId,
        lessonId: data.lessonId,
        amount: data.amount,
        method: data.method,
        status: 'PENDING',
        referenceCode: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        notes: data.notes,
      },
      include: {
        student: true,
        lesson: true,
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}