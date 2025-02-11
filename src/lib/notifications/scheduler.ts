import { prisma } from '@/lib/db';

export async function processNotifications() {
  const now = new Date();
  
  // Process lesson reminders
  const upcomingLessons = await prisma.lesson.findMany({
    where: {
      startTime: {
        gt: now,
        lt: new Date(now.getTime() + 24 * 60 * 60 * 1000) // Next 24 hours
      },
      status: 'SCHEDULED'
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
  const pendingPayments = await prisma.payment.findMany({
    where: {
      status: 'PENDING',
      reminderSentAt: null
    },
    include: {
      student: {
        include: {
          user: true
        }
      }
    }
  });

  return {
    processedLessons: upcomingLessons.length,
    processedPayments: pendingPayments.length
  };
}