import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get total students
    const totalStudents = await prisma.student.count();
    
    // Get active students (had a lesson in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeStudents = await prisma.student.count({
      where: {
        lessons: {
          some: {
            startTime: {
              gte: thirtyDaysAgo
            }
          }
        }
      }
    });

    // Get completed lessons count
    const completedLessons = await prisma.lesson.count({
      where: {
        status: 'COMPLETED'
      }
    });

    // Get total revenue
    const payments = await prisma.payment.aggregate({
      where: {
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      }
    });

    // Get level distribution
    const distribution = await prisma.student.groupBy({
      by: ['level'],
      _count: true
    });

    // Calculate percentages
    const levelDistribution = distribution.map(d => ({
      level: d.level,
      count: d._count,
      percentage: (d._count / totalStudents) * 100
    }));

    return NextResponse.json({
      overview: {
        totalStudents: {
          value: totalStudents,
          change: 0, // TODO: Calculate change
          trend: 'up'
        },
        activeStudents: {
          value: activeStudents,
          change: 0,
          trend: 'up'
        },
        completedLessons: {
          value: completedLessons,
          change: 0,
          trend: 'up'
        },
        revenue: {
          value: payments._sum.amount || 0,
          change: 0,
          trend: 'up'
        }
      },
      distribution: levelDistribution,
      // Other stats will be implemented as needed
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}