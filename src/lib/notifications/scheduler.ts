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

    const upcomingLessons = await prisma.lesson.findMany({
      where: {
        startTime: {
          gte: tomorrowStart,
          lt: tomorrowEnd
        },
        status: 'SCHEDULED'
      },
      include: {
        student: {
          include: {
            user: true
          }
        },
        rink: true
      }
    });

    for (const lesson of upcomingLessons) {
      await sendLessonReminder({
        studentName: lesson.student.user.name!,
        email: lesson.student.user.email!,
        lessonDate: lesson.startTime,
        lessonType: lesson.type,
        rinkName: lesson.rink.name
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
        student: {
          include: {
            user: true
          }
        },
        lesson: true
      }
    });

    for (const payment of pendingPayments) {
      // Only send reminder if the lesson hasn't happened yet
      if (isAfter(payment.lesson.startTime, new Date())) {
        await sendPaymentReminder({
          studentName: payment.student.user.name!,
          email: payment.student.user.email!,
          amount: payment.amount,
          lessonDate: payment.lesson.startTime,
          paymentMethod: payment.method
        });

        // Update payment record to track reminder
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            reminderSentAt: new Date(),
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
