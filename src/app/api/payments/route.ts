import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { appointmentId, method, status, confirmationId, notes } = body;

    // Get the appointment to find the student
    const appointment = await db.query.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        student: true,
      },
    });

    if (!appointment) {
      return new NextResponse('Appointment not found', { status: 404 });
    }

    // Create the payment record
    const payment = await db.query.payment.create({
      data: {
        amount: 75.00, // You might want to make this configurable
        method,
        status,
        confirmationId,
        notes,
        appointmentId,
        studentId: appointment.studentId,
        paidAt: status === 'PAID' ? new Date() : null,
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error recording payment:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    const payment = await db.query.payment.update({
      where: { id },
      data: {
        status,
        paidAt: status === 'PAID' ? new Date() : null,
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error updating payment:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');

    const payments = await db.query.payment.findMany({
      where: studentId ? { studentId } : undefined,
      include: {
        appointment: true,
        student: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
