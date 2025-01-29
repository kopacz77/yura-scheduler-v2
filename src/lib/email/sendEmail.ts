import { Resend } from 'resend';
import { type Student, type Appointment, type Payment } from '@prisma/client';
import { renderAsync } from '@react-email/components';
import { LessonConfirmation } from './templates/LessonConfirmation';
import { PaymentReceipt } from './templates/PaymentReceipt';
import { ScheduleReminder } from './templates/ScheduleReminder';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'notifications@yuraice.com';
const REPLY_TO = 'yura@yuraice.com';

export async function sendLessonConfirmation({
  student,
  appointment,
  cancelUrl,
}: {
  student: Student;
  appointment: Appointment;
  cancelUrl: string;
}) {
  const html = await renderAsync(LessonConfirmation({ student, appointment, cancelUrl }));

  return resend.emails.send({
    from: FROM_EMAIL,
    reply_to: REPLY_TO,
    to: student.email,
    subject: 'Lesson Confirmation - Yura Ice Dance',
    html,
  });
}

export async function sendPaymentReceipt({
  payment,
  student,
  appointment,
}: {
  payment: Payment;
  student: Student;
  appointment: Appointment;
}) {
  const html = await renderAsync(PaymentReceipt({ payment, student, appointment }));

  return resend.emails.send({
    from: FROM_EMAIL,
    reply_to: REPLY_TO,
    to: student.email,
    subject: 'Payment Receipt - Yura Ice Dance',
    html,
  });
}

export async function sendScheduleReminder({
  student,
  appointment,
  manageUrl,
}: {
  student: Student;
  appointment: Appointment;
  manageUrl: string;
}) {
  const html = await renderAsync(ScheduleReminder({ student, appointment, manageUrl }));

  return resend.emails.send({
    from: FROM_EMAIL,
    reply_to: REPLY_TO,
    to: student.email,
    subject: 'Lesson Reminder - Yura Ice Dance',
    html,
  });
}
