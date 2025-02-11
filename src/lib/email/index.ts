import { renderToString } from 'react-dom/server';
import { LessonConfirmation } from './templates/LessonConfirmation';
import { ScheduleReminder } from './templates/ScheduleReminder';
import { PaymentReceipt } from './templates/PaymentReceipt';

const sendEmail = async (to: string, subject: string, html: string) => {
  const response = await fetch('/api/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, html }),
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }

  return response.json();
};

export const sendLessonConfirmation = async (student: any, lesson: any) => {
  const html = renderToString(
    LessonConfirmation({ student, lesson })
  );

  return sendEmail(
    student.user.email,
    'Lesson Confirmation',
    html
  );
};

export const sendScheduleReminder = async (student: any, lesson: any) => {
  const html = renderToString(
    ScheduleReminder({ student, lesson })
  );

  return sendEmail(
    student.user.email,
    'Upcoming Lesson Reminder',
    html
  );
};

export const sendPaymentReceipt = async (payment: any, student: any, lesson: any) => {
  const html = renderToString(
    PaymentReceipt({ payment, student, lesson })
  );

  return sendEmail(
    student.user.email,
    'Payment Receipt',
    html
  );
};

// Re-export email templates
export { LessonConfirmation, ScheduleReminder, PaymentReceipt };
