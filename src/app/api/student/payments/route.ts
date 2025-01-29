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

    // Get all payments for the student
    const payments = await prisma.payment.findMany({
      where: {
        studentId: student.id
      },
      include: {
        appointment: {
          include: {
            resource: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching student payments:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { userId: session.user.id }
    });

    if (!student) {
      return new NextResponse('Student not found', { status: 404 });
    }

    const body = await req.json();
    const { appointmentId, method, amount } = body;

    // Verify the appointment belongs to the student
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    });

    if (!appointment || appointment.studentId !== student.id) {
      return new NextResponse('Invalid appointment', { status: 400 });
    }

    // Create new payment record
    const payment = await prisma.payment.create({
      data: {
        amount,
        method,
        status: 'PENDING',
        studentId: student.id,
        appointmentId
      },
      include: {
        appointment: {
          include: {
            resource: true
          }
        }
      }
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
