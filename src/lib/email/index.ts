import { Resend } from 'resend';
import {
  getLessonConfirmationEmail,
  getPaymentConfirmationEmail,
  getLessonReminderEmail,
  getPaymentReminderEmail
} from './templates';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const data = await resend.emails.send({
      from: 'Yura Min <lessons@yuramin.com>',
      to,
      subject,
      html
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendLessonConfirmation(data: {
  studentName: string;
  email: string;
  lessonDate: Date;
  lessonType: string;
  resourceName: string;
  amount: number;
  paymentMethod: string;
}) {
  const emailContent = getLessonConfirmationEmail({
    studentName: data.studentName,
    lessonDate: data.lessonDate,
    lessonType: data.lessonType,
    resourceName: data.resourceName,
    amount: data.amount,
    paymentMethod: data.paymentMethod
  });

  return sendEmail({
    to: data.email,
    ...emailContent
  });
}

export async function sendPaymentConfirmation(data: {
  studentName: string;
  email: string;
  amount: number;
  lessonDate: Date;
  paymentMethod: string;
  confirmationId?: string;
}) {
  const emailContent = getPaymentConfirmationEmail({
    studentName: data.studentName,
    amount: data.amount,
    lessonDate: data.lessonDate,
    paymentMethod: data.paymentMethod,
    confirmationId: data.confirmationId
  });

  return sendEmail({
    to: data.email,
    ...emailContent
  });
}

export async function sendLessonReminder(data: {
  studentName: string;
  email: string;
  lessonDate: Date;
  lessonType: string;
  resourceName: string;
}) {
  const emailContent = getLessonReminderEmail({
    studentName: data.studentName,
    lessonDate: data.lessonDate,
    lessonType: data.lessonType,
    resourceName: data.resourceName
  });

  return sendEmail({
    to: data.email,
    ...emailContent
  });
}

export async function sendPaymentReminder(data: {
  studentName: string;
  email: string;
  amount: number;
  lessonDate: Date;
  paymentMethod: string;
}) {
  const emailContent = getPaymentReminderEmail({
    studentName: data.studentName,
    amount: data.amount,
    lessonDate: data.lessonDate,
    paymentMethod: data.paymentMethod
  });

  return sendEmail({
    to: data.email,
    ...emailContent
  });
}
