import { Resend } from 'resend';
import { PaymentMethod, LessonType } from '@prisma/client';
import React from 'react';
import { LessonConfirmation } from './templates/LessonConfirmation';
import { PaymentReceipt } from './templates/PaymentReceipt';
import { ScheduleReminder } from './templates/ScheduleReminder';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  htmlContent,
}: {
  to: string;
  subject: string;
  htmlContent: React.ReactElement;
}) {
  try {
    const data = await resend.emails.send({
      from: 'YM Movement <no-reply@ymmove.com>',
      to,
      subject,
      react: htmlContent,
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
  return sendEmail({
    to: details.email,
    subject: 'Upcoming Lesson Reminder',
    htmlContent: React.createElement(ScheduleReminder, {
      student: {
        user: {
          name: details.studentName
        }
      },
      lesson: {
        startTime: details.lessonDate,
        endTime: new Date(details.lessonDate.getTime() + 60 * 60 * 1000), // Add 1 hour for end time
        type: details.lessonType
      },
      manageUrl: '/dashboard/schedule'
    })
  });
}

export async function sendPaymentReminder(details: PaymentReminderDetails) {
  return sendEmail({
    to: details.email,
    subject: 'Payment Reminder',
    htmlContent: React.createElement(PaymentReceipt, {
      student: {
        user: {
          name: details.studentName
        }
      },
      payment: {
        amount: details.amount,
        method: details.paymentMethod,
        createdAt: new Date()
      },
      lesson: {
        startTime: details.lessonDate,
        endTime: new Date(details.lessonDate.getTime() + 60 * 60 * 1000), // Add 1 hour for end time
        type: 'PRIVATE'
      }
    })
  });
}