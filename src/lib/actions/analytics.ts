import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, subDays } from 'date-fns';

export async function getAnalyticsData() {
  'use server';

  const now = new Date();
  const startOfCurrentMonth = startOfMonth(now);
  const endOfCurrentMonth = endOfMonth(now);
  const startOfPreviousMonth = startOfMonth(subDays(startOfCurrentMonth, 1));
  const endOfPreviousMonth = endOfMonth(startOfPreviousMonth);

  // Get total students and calculate growth
  const totalStudents = await prisma.student.count();
  const previousMonthStudents = await prisma.student.count({
    where: {
      createdAt: {
        lt: startOfCurrentMonth,
      },
    },
  });

  // Get current and previous month lessons
  const [currentMonthLessons, previousMonthLessons] = await Promise.all([
    prisma.lesson.findMany({
      where: {
        startTime: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
      },
      include: {
        payment: true,
      },
    }),
    prisma.lesson.findMany({
      where: {
        startTime: {
          gte: startOfPreviousMonth,
          lte: endOfPreviousMonth,
        },
      },
      include: {
        payment: true,
      },
    }),
  ]);

  // Calculate revenue metrics
  const monthlyRevenue = currentMonthLessons.reduce(
    (sum, lesson) => sum + (lesson.payment?.amount || 0),
    0
  );
  const previousMonthRevenue = previousMonthLessons.reduce(
    (sum, lesson) => sum + (lesson.payment?.amount || 0),
    0
  );

  // Calculate growth percentages
  const studentGrowth = previousMonthStudents
    ? Math.round(((totalStudents - previousMonthStudents) / previousMonthStudents) * 100)
    : 0;
  const lessonGrowth = previousMonthLessons.length
    ? Math.round(((currentMonthLessons.length - previousMonthLessons.length) / previousMonthLessons.length) * 100)
    : 0;
  const revenueGrowth = previousMonthRevenue
    ? Math.round(((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100)
    : 0;

  // Calculate average session length
  const averageSessionLength = Math.round(
    currentMonthLessons.reduce((sum, lesson) => sum + lesson.duration, 0) /
      (currentMonthLessons.length || 1)
  );

  // Generate last 6 months revenue data
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const revenueData = await prisma.payment.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        gte: sixMonthsAgo,
        lte: now,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const revenueByMonth = revenueData.reduce((acc, data) => {
    const month = format(data.createdAt, 'MMM yyyy');
    acc.push({
      date: month,
      revenue: data._sum.amount || 0,
    });
    return acc;
  }, [] as Array<{ date: string; revenue: number }>);

  // Generate last 7 days activity data
  const last7Days = eachDayOfInterval({
    start: subDays(now, 6),
    end: now,
  });

  const activityData = await Promise.all(
    last7Days.map(async (date) => {
      const lessons = await prisma.lesson.count({
        where: {
          startTime: {
            gte: startOfMonth(date),
            lte: endOfMonth(date),
          },
        },
      });

      return {
        day: format(date, 'EEE'),
        lessons,
      };
    })
  );

  // Get top students by lesson count
  const topStudents = await prisma.student.findMany({
    take: 5,
    include: {
      user: true,
      lessons: {
        where: {
          startTime: {
            gte: startOfCurrentMonth,
            lte: endOfCurrentMonth,
          },
        },
      },
    },
    orderBy: {
      lessons: {
        _count: 'desc',
      },
    },
  });

  return {
    stats: {
      totalStudents,
      lessonsThisMonth: currentMonthLessons.length,
      monthlyRevenue,
      averageSessionLength,
      studentGrowth,
      lessonGrowth,
      revenueGrowth,
    },
    revenueData: revenueByMonth,
    activityData,
    topStudents: topStudents.map(student => ({
      id: student.id,
      name: student.user.name || 'Anonymous',
      email: student.user.email,
      lessonsCount: student.lessons.length,
    })),
  };
}
