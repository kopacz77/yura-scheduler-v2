import { type Lesson } from '@prisma/client';
import { StudentWithUser } from '@/types/student';
import { lessonConfirmation, paymentReceipt } from './templates';
import { formatDate, formatTime } from '@/lib/utils/date';
import { renderEmailTemplate } from './render';

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
  const template = lessonConfirmation({
    studentName: student.user.name || 'Student',
    lessonDate: formatDate(lesson.startTime),
    lessonTime: formatTime(lesson.startTime),
    lessonType: lesson.type,
    duration: lesson.duration,
    price: lesson.price
  });

  const html = renderEmailTemplate(template);
  return sendEmail(student.user.email, template.subject, html);
}

export async function sendPaymentConfirmation(student: StudentWithUser, payment: any, lesson: Lesson) {
  const template = paymentReceipt({
    studentName: student.user.name || 'Student',
    amount: payment.amount,
    method: payment.method,
    referenceCode: payment.referenceCode,
    date: formatDate(payment.createdAt),
    lesson: {
      date: formatDate(lesson.startTime),
      time: formatTime(lesson.startTime),
      duration: lesson.duration,
      type: lesson.type
    }
  });

  const html = renderEmailTemplate(template);
  return sendEmail(student.user.email, template.subject, html);
}