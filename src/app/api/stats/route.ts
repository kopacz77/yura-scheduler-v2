import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Debug queries
    console.log('Fetching stats...');

    // Get students info
    const [totalStudents, completedLessons, payments, distribution] = await Promise.all([
      // Total students
      prisma.student.count(),
      
      // Completed lessons
      prisma.lesson.count({
        where: {
          status: 'COMPLETED'
        }
      }),

      // Revenue
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED'
        },
        _sum: {
          amount: true
        }
      }),

      // Level distribution
      prisma.student.groupBy({
        by: ['level'],
        _count: true
      })
    ]);

    console.log('Stats fetched:', { totalStudents, completedLessons, payments, distribution });

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

    // Calculate level distribution percentages
    const levelDistribution = distribution.map(d => ({
      level: d.level,
      count: d._count,
      percentage: totalStudents > 0 ? (d._count / totalStudents) * 100 : 0
    }));

    const stats = {
      overview: {
        totalStudents: {
          value: totalStudents,
          change: 0,
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
      distribution: levelDistribution
    };

    console.log('Returning stats:', stats);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch stats', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}