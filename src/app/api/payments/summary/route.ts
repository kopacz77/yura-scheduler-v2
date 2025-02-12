import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get last 30 days of data
    const endDate = endOfDay(new Date());
    const startDate = startOfDay(subDays(endDate, 30));

    // Get all completed payments in date range
    const payments = await prisma.payment.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Calculate daily totals
    const dailyData = new Map();
    const today = format(new Date(), 'yyyy-MM-dd');

    // Initialize all days in range
    for (let i = 0; i <= 30; i++) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      dailyData.set(date, {
        date,
        amount: 0,
        count: 0,
      });
    }

    // Aggregate payment data
    payments.forEach((payment) => {
      const date = format(payment.createdAt, 'yyyy-MM-dd');
      if (dailyData.has(date)) {
        const dayData = dailyData.get(date);
        dayData.amount += payment.amount;
        dayData.count += 1;
      }
    });

    // Calculate totals
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalPayments = payments.length;

    // Convert Map to array and sort by date
    const dailyDataArray = Array.from(dailyData.values())
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      dailyData: dailyDataArray,
      totalRevenue,
      totalPayments,
    });
  } catch (error) {
    console.error('Error fetching payment summary:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
