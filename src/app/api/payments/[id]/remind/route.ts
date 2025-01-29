import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: {
        student: true,
        appointment: true
      }
    });

    if (!payment) {
      return new NextResponse('Payment not found', { status: 404 });
    }

    if (payment.status !== 'PENDING') {
      return new NextResponse('Payment is not pending', { status: 400 });
    }

    const emailData = {
      to: payment.student.email,
      subject: 'Payment Reminder',
      html: `
        <h1>Payment Reminder</h1>
        <p>Dear ${payment.student.name},</p>
        <p>This is a friendly reminder about your pending payment:</p>
        <ul>
          <li>Amount: $${payment.amount}</li>
          <li>Lesson Date: ${new Date(payment.appointment.start).toLocaleString()}</li>
          <li>Payment Method: ${payment.method}</li>
        </ul>
        <p>Please complete your payment using the selected payment method (${payment.method}).</p>
        <p>If you've already made the payment, please let us know the confirmation details.</p>
      `
    };

    await sendEmail(emailData);

    // Update the payment record to track the reminder
    await prisma.payment.update({
      where: { id: params.id },
      data: {
        notes: payment.notes
          ? `${payment.notes}\nReminder sent on ${new Date().toLocaleString()}`
          : `Reminder sent on ${new Date().toLocaleString()}`
      }
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error sending payment reminder:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
