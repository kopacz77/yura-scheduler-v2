import { prisma } from '@/lib/prisma';
import { sendLessonReminder, sendPaymentReminder } from '@/lib/email';
import { addHours, format, isBefore, isAfter, addDays } from 'date-fns';

interface NotificationResult {
  lessonsProcessed: number;
  paymentsProcessed: number;
}

export async function processNotifications(): Promise<NotificationResult> {
  const now = new Date();
  const tomorrow = addDays(now, 1);

  // Find upcoming lessons within the next 24 hours
  const upcomingLessons = await prisma.lesson.findMany({
    where: {
      startTime: {
        gte: now,
        lt: tomorrow
      },
      status: 'SCHEDULED',
      payment: {
        reminderSentAt: null // Using the Payment model's reminderSentAt field
      }
    },
    include: {
      student: {
        include: {
          user: true
        }
      },
      rink: true,
      payment: true
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

      // If there's a payment record, update its reminderSentAt
      if (lesson.payment) {
        await prisma.payment.update({
          where: { id: lesson.payment.id },
          data: { reminderSentAt: new Date() }
        });
      }

    } catch (error) {
      console.error('Failed to send lesson reminder:', error);
      // Log error but continue with other notifications
    }
  }

  // Find unpaid lessons from the past week
  const unpaidLessons = await prisma.lesson.findMany({
    where: {
      status: 'COMPLETED',
      payment: {
        status: 'PENDING',
        reminderSentAt: null
      },
      startTime: {
        lt: now,
        gte: addDays(now, -7)
      }
    },
    include: {
      student: {
        include: {
          user: true
        }
      },
      payment: true
    }
  });

  // Process payment reminders
  for (const lesson of unpaidLessons) {
    try {
      await sendPaymentReminder({
        studentName: lesson.student.user.name || 'Student',
        amount: lesson.price,
        date: format(lesson.startTime, 'MMMM do, yyyy'),
        lessonType: lesson.type,
        email: lesson.student.user.email
      });

      // Update payment reminder sent timestamp
      if (lesson.payment) {
        await prisma.payment.update({
          where: { id: lesson.payment.id },
          data: { reminderSentAt: new Date() }
        });
      }

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
