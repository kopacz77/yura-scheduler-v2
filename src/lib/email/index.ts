import { Resend } from 'resend';
import { ScheduleReminder } from './templates/ScheduleReminder';
import { PaymentReceipt } from './templates/PaymentReceipt';
import { renderAsync } from '@react-email/components';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLessonReminder({
  studentName,
  lessonDate,
  lessonTime,
  location,
  email
}: {
  studentName: string;
  lessonDate: string;
  lessonTime: string;
  location: string;
  email: string;
}) {
  const html = await renderAsync(
    ScheduleReminder({
      studentName,
      lessonDate,
      lessonTime,
      location
    })
  );

  return resend.emails.send({
    from: 'Yura Min <admin@yuramin.com>',
    to: email,
    subject: 'Upcoming Lesson Reminder',
    html
  });
}

export async function sendPaymentReminder({
  studentName,
  amount,
  date,
  lessonType,
  email
}: {
  studentName: string;
  amount: number;
  date: string;
  lessonType: string;
  email: string;
}) {
  const html = await renderAsync(
    PaymentReceipt({
      studentName,
      amount,
      date,
      lessonType
    })
  );

  return resend.emails.send({
    from: 'Yura Min <admin@yuramin.com>',
    to: email,
    subject: 'Payment Receipt',
    html
  });
}

// Re-export the email templates
export * from './templates/ScheduleReminder';
export * from './templates/PaymentReceipt';