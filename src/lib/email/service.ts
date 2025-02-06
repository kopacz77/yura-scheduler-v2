import { Resend } from 'resend';
import { emailTemplates, generateReferenceCode } from './templates';
import { Lesson, Student, User } from '@prisma/client';

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
  private static async sendEmail({
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
        from: 'Yura Min Academy <info@ym-movement.com>',
        to,
        reply_to: 'yuraxmin@gmail.com',
        subject,
        html,
      });
      return { success: true, data };
    } catch (error) {
      console.error('Failed to send email:', error);
      return { success: false, error };
    }
  }

  static async sendBookingConfirmation({
    lesson,
    student,
    price,
    paymentMethod,
  }: {
    lesson: Lesson;
    student: Student & { user: User };
    price: number;
    paymentMethod: 'VENMO' | 'ZELLE';
  }) {
    const referenceCode = generateReferenceCode(
      student.user.name || 'Student',
      lesson.startTime
    );

    const { subject, html } = emailTemplates.bookingConfirmation({
      studentName: student.user.name || 'Student',
      date: lesson.startTime,
      startTime: lesson.startTime,
      endTime: lesson.endTime,
      location: lesson.rinkId,
      address: 'TODO: Get rink address', // We'll need to add this to our rink data
      duration: lesson.duration,
      price,
      paymentMethod,
      referenceCode,
    });

    return this.sendEmail({
      to: student.user.email,
      subject,
      html,
    });
  }

  static async sendCancellationNotification({
    lesson,
    student,
  }: {
    lesson: Lesson;
    student: Student & { user: User };
  }) {
    const { subject, html } = emailTemplates.lessonCancelled({
      studentName: student.user.name || 'Student',
      date: lesson.startTime,
      startTime: lesson.startTime,
      endTime: lesson.endTime,
      location: lesson.rinkId,
      address: 'TODO: Get rink address',
      duration: lesson.duration,
      price: 0, // Not needed for cancellation
    });

    return this.sendEmail({
      to: student.user.email,
      subject,
      html,
    });
  }

  static async sendLessonReminder({
    lesson,
    student,
    price,
    isPaid,
  }: {
    lesson: Lesson;
    student: Student & { user: User };
    price: number;
    isPaid: boolean;
  }) {
    const { subject, html } = emailTemplates.lessonReminder({
      studentName: student.user.name || 'Student',
      date: lesson.startTime,
      startTime: lesson.startTime,
      endTime: lesson.endTime,
      location: lesson.rinkId,
      address: 'TODO: Get rink address',
      duration: lesson.duration,
      price,
      paymentMethod: isPaid ? undefined : 'VENMO', // Show payment reminder if not paid
    });

    return this.sendEmail({
      to: student.user.email,
      subject,
      html,
    });
  }
}