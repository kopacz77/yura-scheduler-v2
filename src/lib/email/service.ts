import { type Lesson } from '@prisma/client';
import { StudentWithUser } from '@/types/student';
import { emailTemplates } from './templates';

export async function sendEmail(to: string, subject: string, html: string) {
  const response = await fetch('/api/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, html }),
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }

  return response.json();
}

export async function sendLessonConfirmation(student: StudentWithUser, lesson: Lesson) {
  const { subject, body } = emailTemplates.lessonConfirmation(student, lesson);
  return sendEmail(student.user.email, subject, body);
}

export async function sendScheduleReminder(student: StudentWithUser, lesson: Lesson) {
  const { subject, body } = emailTemplates.scheduleReminder(student, lesson);
  return sendEmail(student.user.email, subject, body);
}

export async function sendPaymentReceipt(student: StudentWithUser, lesson: Lesson, payment: any) {
  const { subject, body } = emailTemplates.paymentReceipt(student, payment, lesson);
  return sendEmail(student.user.email, subject, body);
}
