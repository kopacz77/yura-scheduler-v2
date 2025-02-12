import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Role } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 1 minute

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user has admin access for all stats
    const isAdmin = session.user.role === Role.ADMIN;

    // Time period calculations
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const previousThirtyDays = new Date(thirtyDaysAgo);
    previousThirtyDays.setDate(previousThirtyDays.getDate() - 30);

    // Fetch current period stats
    const [
      totalStudents,
      activeStudents,
      completedLessons,
      payments,
      distribution
    ] = await Promise.all([
      // Total students
      prisma.student.count(),
      
      // Active students (had a lesson in last 30 days)
      prisma.student.count({
        where: {
          lessons: {
            some: {
              startTime: { gte: thirtyDaysAgo }
            }
          }
        }
      }),

      // Completed lessons in last 30 days
      prisma.lesson.count({
        where: {
          status: 'COMPLETED',
          startTime: { gte: thirtyDaysAgo }
        }
      }),

      // Revenue from last 30 days
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: thirtyDaysAgo }
        },
        _sum: { amount: true }
      }),

      // Level distribution
      prisma.student.groupBy({
        by: ['level'],
        _count: true,
        orderBy: { level: 'asc' }
      })
    ]);

    // Fetch previous period stats for trends
    const [
      previousActiveStudents,
      previousCompletedLessons,
      previousPayments
    ] = await Promise.all([
      prisma.student.count({
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
      }),

      prisma.lesson.count({
        where: {
          status: 'COMPLETED',
          startTime: {
            gte: previousThirtyDays,
            lt: thirtyDaysAgo
          }
        }
      }),

      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: previousThirtyDays,
            lt: thirtyDaysAgo
          }
        },
        _sum: { amount: true }
      })
    ]);

    // Calculate trends
    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return { change: 100, trend: 'up' };
      const change = ((current - previous) / previous) * 100;
      return {
        change: Math.round(change * 10) / 10,
        trend: change >= 0 ? 'up' : 'down'
      };
    };

    // Calculate level distribution percentages
    const levelDistribution = distribution.map(d => ({
      level: d.level,
      count: d._count,
      percentage: totalStudents > 0 ? (d._count / totalStudents) * 100 : 0
    }));

    const currentRevenue = payments._sum.amount || 0;
    const previousRevenue = previousPayments._sum.amount || 0;

    const stats = {
      overview: {
        totalStudents: {
          value: totalStudents,
          ...calculateTrend(totalStudents, totalStudents) // No previous data for total
        },
        activeStudents: {
          value: activeStudents,
          ...calculateTrend(activeStudents, previousActiveStudents)
        },
        completedLessons: {
          value: completedLessons,
          ...calculateTrend(completedLessons, previousCompletedLessons)
        },
        revenue: {
          value: currentRevenue,
          ...calculateTrend(currentRevenue, previousRevenue)
        }
      },
      distribution: levelDistribution
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Failed to fetch stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}