import { format } from 'date-fns';
import { Payment, Lesson } from '@prisma/client';
import type { StudentWithUser } from '@/types/student';

export function generateReferenceCode(): string {
  return `PMT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export const emailTemplates = {
  lessonConfirmation: (student: StudentWithUser, lesson: Lesson) => ({
    subject: 'Lesson Confirmation',
    body: `
      Hi ${student.user.name},

      Your lesson has been scheduled for ${format(lesson.startTime, 'MMMM do, yyyy')} at ${format(lesson.startTime, 'h:mm a')}.

      Duration: ${lesson.duration} minutes
      Type: ${lesson.type}
      Price: $${lesson.price.toFixed(2)}

      Please arrive 10 minutes before your lesson time.

      Best regards,
      Yura Min's Ice Dance Studio
    `.trim()
  }),

  scheduleReminder: (student: StudentWithUser, lesson: Lesson) => ({
    subject: 'Upcoming Lesson Reminder',
    body: `
      Hi ${student.user.name},

      This is a reminder about your upcoming lesson tomorrow at ${format(lesson.startTime, 'h:mm a')}.

      Duration: ${lesson.duration} minutes
      Type: ${lesson.type}

      Please remember to arrive 10 minutes early.

      Best regards,
      Yura Min's Ice Dance Studio
    `.trim()
  }),

  paymentReceipt: (student: StudentWithUser, payment: Payment, lesson: Lesson) => ({
    subject: 'Payment Receipt',
    body: `
      Hi ${student.user.name},

      Thank you for your payment. Here are the details:

      Amount: $${payment.amount.toFixed(2)}
      Method: ${payment.method}
      Reference Code: ${payment.referenceCode}
      Date: ${format(payment.createdAt, 'MMMM do, yyyy')}

      Lesson Details:
      Date: ${format(lesson.startTime, 'MMMM do, yyyy')}
      Time: ${format(lesson.startTime, 'h:mm a')}
      Duration: ${lesson.duration} minutes
      Type: ${lesson.type}

      Best regards,
      Yura Min's Ice Dance Studio
    `.trim()
  }),

  paymentReminder: (student: StudentWithUser, payment: Payment, lesson: Lesson) => ({
    subject: 'Payment Reminder',
    body: `
      Hi ${student.user.name},

      This is a reminder about your pending payment:

      Amount: $${payment.amount.toFixed(2)}
      Reference Code: ${payment.referenceCode}
      Lesson Date: ${format(lesson.startTime, 'MMMM do, yyyy')}

      Please complete your payment at your earliest convenience.

      Best regards,
      Yura Min's Ice Dance Studio
    `.trim()
  })
};
