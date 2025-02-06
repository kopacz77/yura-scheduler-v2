import { Resend } from 'resend';
import { PaymentMethod, LessonType } from '@prisma/client';
import { render } from '@react-email/render';
import { LessonConfirmation } from './templates/LessonConfirmation';
import { PaymentReceipt } from './templates/PaymentReceipt';
import { ScheduleReminder } from './templates/ScheduleReminder';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const data = await resend.emails.send({
      from: 'YM Movement <no-reply@ymmove.com>',
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

interface LessonReminderDetails {
  studentName: string;
  email: string;
  lessonDate: Date;
  lessonType: LessonType;
  rinkName: string;
}

interface PaymentReminderDetails {
  studentName: string;
  email: string;
  amount: number;
  lessonDate: Date;
  paymentMethod: PaymentMethod;
}

export async function sendLessonReminder(details: LessonReminderDetails) {
  const emailHtml = render(
    ScheduleReminder({
      student: { user: { name: details.studentName } },
      lesson: {
        startTime: details.lessonDate,
        type: details.lessonType,
      },
      manageUrl: '/dashboard/schedule'
    })
  );

  return sendEmail({
    to: details.email,
    subject: 'Upcoming Lesson Reminder',
    html: emailHtml,
  });
}

export async function sendPaymentReminder(details: PaymentReminderDetails) {
  const emailHtml = render(
    PaymentReceipt({
      student: { user: { name: details.studentName } },
      payment: {
        amount: details.amount,
        method: details.paymentMethod,
        createdAt: new Date(),
      },
      lesson: {
        startTime: details.lessonDate,
        type: 'PRIVATE',
      }
    })
  );

  return sendEmail({
    to: details.email,
    subject: 'Payment Reminder',
    html: emailHtml,
  });
}