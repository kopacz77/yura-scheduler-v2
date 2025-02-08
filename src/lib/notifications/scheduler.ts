import { prisma } from '@/lib/prisma';
import { sendLessonReminder, sendPaymentReminder } from '@/lib/email';
import { addHours, format, isBefore, isAfter, addDays } from 'date-fns';

export async function processNotifications() {
  const now = new Date();
  const tomorrow = addDays(now, 1);

  // Find upcoming lessons within the next 24 hours
  const upcomingLessons = await prisma.lesson.findMany({
    where: {
      startTime: {
        gte: now,
        lt: tomorrow
      },
      // Only send for confirmed lessons
      status: 'CONFIRMED',
      // Only get lessons where reminder hasn't been sent
      reminderSent: false
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

  // Process each lesson
  for (const lesson of upcomingLessons) {
    try {
      await sendLessonReminder({
        studentName: lesson.student.user.name || 'Student',
        lessonDate: format(lesson.startTime, 'MMMM do, yyyy'),
        lessonTime: format(lesson.startTime, 'h:mm a'),
        location: lesson.rink.name,
        email: lesson.student.user.email
      });

      // Mark reminder as sent
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: { reminderSent: true }
      });

    } catch (error) {
      console.error('Failed to send lesson reminder:', error);
      // Log error but continue with other notifications
    }
  }

  // Find unpaid lessons from the past week
  const unpaidLessons = await prisma.lesson.findMany({
    where: {
      status: 'COMPLETED',
      paymentStatus: 'PENDING',
      startTime: {
        lt: now,
        gte: addDays(now, -7)
      },
      paymentReminderSent: false
    },
    include: {
      student: {
        include: {
          user: true
        }
      }
    }
  });

  // Process payment reminders
  for (const lesson of unpaidLessons) {
    try {
      await sendPaymentReminder({
        studentName: lesson.student.user.name || 'Student',
        amount: lesson.cost,
        date: format(lesson.startTime, 'MMMM do, yyyy'),
        lessonType: lesson.type,
        email: lesson.student.user.email
      });

      // Mark payment reminder as sent
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: { paymentReminderSent: true }
      });

    } catch (error) {
      console.error('Failed to send payment reminder:', error);
      // Log error but continue with other notifications
    }
  }

  return {
    lessonsProcessed: upcomingLessons.length,
    paymentsProcessed: unpaidLessons.length
  };
}
