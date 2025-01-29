import { NextResponse } from 'next/server';
import { renderAsync } from '@react-email/components';
import { Resend } from 'resend';
import { LessonConfirmation } from '@/lib/email/templates/LessonConfirmation';
import { PaymentReceipt } from '@/lib/email/templates/PaymentReceipt';
import { ScheduleReminder } from '@/lib/email/templates/ScheduleReminder';

const resend = new Resend(process.env.RESEND_API_KEY);

// Sample data for test emails
const sampleData = {
  student: {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '123-456-7890',
    level: 'INTERMEDIATE',
    notes: 'Sample student notes',
    preferredPayment: 'VENMO',
    startDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  appointment: {
    id: '1',
    title: 'Private Lesson',
    start: new Date(),
    end: new Date(Date.now() + 60 * 60 * 1000),
    lessonType: 'PRIVATE',
    notes: 'Sample lesson notes',
    studentId: '1',
    resourceId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  payment: {
    id: '1',
    amount: 75.00,
    method: 'VENMO',
    status: 'CONFIRMED',
    confirmationId: 'VNM123456',
    appointmentId: '1',
    studentId: '1',
    notes: 'Sample payment notes',
    paidAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export async function POST(request: Request) {
  try {
    const { templateId, email } = await request.json();

    let html: string;
    let subject: string;

    switch (templateId) {
      case 'lesson-confirmation':
        html = await renderAsync(
          LessonConfirmation({
            student: sampleData.student,
            appointment: sampleData.appointment,
            cancelUrl: 'http://example.com/cancel',
          })
        );
        subject = 'Test: Lesson Confirmation';
        break;

      case 'payment-receipt':
        html = await renderAsync(
          PaymentReceipt({
            student: sampleData.student,
            appointment: sampleData.appointment,
            payment: sampleData.payment,
          })
        );
        subject = 'Test: Payment Receipt';
        break;

      case 'schedule-reminder':
        html = await renderAsync(
          ScheduleReminder({
            student: sampleData.student,
            appointment: sampleData.appointment,
            manageUrl: 'http://example.com/manage',
          })
        );
        subject = 'Test: Schedule Reminder';
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid template ID' },
          { status: 400 }
        );
    }

    const response = await resend.emails.send({
      from: 'test@yuraice.com',
      to: email,
      subject,
      html,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}