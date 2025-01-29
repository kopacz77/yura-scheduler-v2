import prisma from '@/lib/prisma';
import { addDays, subHours, isAfter } from 'date-fns';
import {
  sendLessonReminder,
  sendPaymentReminder
} from '@/lib/email';

export async function scheduleNotifications() {
  try {
    // Schedule lesson reminders for next day's lessons
    const tomorrowStart = addDays(new Date(), 1);
    const tomorrowEnd = addDays(tomorrowStart, 1);

    const upcomingLessons = await prisma.appointment.findMany({
      where: {
        start: {
          gte: tomorrowStart,
          lt: tomorrowEnd
        }
      },
      include: {
        student: true,
        resource: true
      }
    });

    for (const lesson of upcomingLessons) {
      await sendLessonReminder({
        studentName: lesson.student.name,
        email: lesson.student.email,
        lessonDate: lesson.start,
        lessonType: lesson.lessonType,
        resourceName: lesson.resource.name
      });
    }

    // Check for pending payments older than 48 hours
    const pendingPayments = await prisma.payment.findMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: subHours(new Date(), 48)
        }
      },
      include: {
        student: true,
        appointment: true
      }
    });

    for (const payment of pendingPayments) {
      // Only send reminder if the lesson hasn't happened yet
      if (isAfter(payment.appointment.start, new Date())) {
        await sendPaymentReminder({
          studentName: payment.student.name,
          email: payment.student.email,
          amount: payment.amount,
          lessonDate: payment.appointment.start,
          paymentMethod: payment.method
        });

        // Update payment record to track reminder
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            notes: payment.notes
              ? `${payment.notes}\nReminder sent on ${new Date().toLocaleString()}`
              : `Reminder sent on ${new Date().toLocaleString()}`
          }
        });
      }
    }
  } catch (error) {
    console.error('Error scheduling notifications:', error);
  }
}
