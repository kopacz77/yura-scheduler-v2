import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Role, Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 1 minute

export async function GET(req: Request) {
  try {
    // Test database connection first
    try {
      await prisma.$connect();
    } catch (connectionError) {
      console.error('Database connection error:', connectionError);
      return new NextResponse(
        JSON.stringify({
          error: 'Database connection failed',
          details: connectionError instanceof Error ? connectionError.message : 'Unknown connection error',
          errorCode: 'DB_CONNECTION_ERROR'
        }),
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Default values in case of partial data failures
    const defaultStats = {
      overview: {
        totalStudents: { value: 0, change: 0, trend: 'up' },
        activeStudents: { value: 0, change: 0, trend: 'up' },
        completedLessons: { value: 0, change: 0, trend: 'up' },
        revenue: { value: 0, change: 0, trend: 'up' }
      },
      distribution: []
    };

    // Time period calculations
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const previousThirtyDays = new Date(thirtyDaysAgo);
    previousThirtyDays.setDate(previousThirtyDays.getDate() - 30);

    // Fetch stats with individual error handling
    const stats = { ...defaultStats };
    
    try {
      // Total students
      stats.overview.totalStudents.value = await prisma.student.count();
      
      // Active students
      const activeStudents = await prisma.student.count({
        where: {
          lessons: {
            some: {
              startTime: { gte: thirtyDaysAgo }
            }
          }
        }
      });
      
      const previousActiveStudents = await prisma.student.count({
        where: {
          lessons: {
            some: {
              startTime: {
                gte: previousThirtyDays,
                lt: thirtyDaysAgo
              }
            }
          }
        }
      });

      stats.overview.activeStudents = {
        value: activeStudents,
        ...calculateTrend(activeStudents, previousActiveStudents)
      };

      // Completed lessons
      const completedLessons = await prisma.lesson.count({
        where: {
          status: 'COMPLETED',
          startTime: { gte: thirtyDaysAgo }
        }
      });

      const previousCompletedLessons = await prisma.lesson.count({
        where: {
          status: 'COMPLETED',
          startTime: {
            gte: previousThirtyDays,
            lt: thirtyDaysAgo
          }
        }
      });

      stats.overview.completedLessons = {
        value: completedLessons,
        ...calculateTrend(completedLessons, previousCompletedLessons)
      };

      // Revenue
      const payments = await prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: thirtyDaysAgo }
        },
        _sum: { amount: true }
      });

      const previousPayments = await prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: previousThirtyDays,
            lt: thirtyDaysAgo
          }
        },
        _sum: { amount: true }
      });

      const currentRevenue = payments._sum.amount || 0;
      const previousRevenue = previousPayments._sum.amount || 0;

      stats.overview.revenue = {
        value: currentRevenue,
        ...calculateTrend(currentRevenue, previousRevenue)
      };

      // Level distribution
      const distribution = await prisma.student.groupBy({
        by: ['level'],
        _count: true,
        orderBy: { level: 'asc' }
      });

      stats.distribution = distribution.map(d => ({
        level: d.level,
        count: d._count,
        percentage: stats.overview.totalStudents.value > 0 
          ? (d._count / stats.overview.totalStudents.value) * 100 
          : 0
      }));

    } catch (error) {
      console.error('Error fetching individual stats:', error);
      // Continue with default values for failed queries
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in stats endpoint:', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Failed to fetch stats',
        details: error instanceof Error ? error.message : 'Unknown error',
        errorCode: 'STATS_FETCH_ERROR'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}

function calculateTrend(current: number, previous: number) {
  if (previous === 0) return { change: 100, trend: 'up' as const };
  const change = ((current - previous) / previous) * 100;
  return {
    change: Math.round(change * 10) / 10,
    trend: change >= 0 ? 'up' as const : 'down' as const
  };
}