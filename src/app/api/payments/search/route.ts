import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const status = searchParams.get('status');

    const payments = await prisma.payment.findMany({
      where: {
        OR: [
          {
            student: {
              user: {
                name: {
                  contains: query || '',
                  mode: 'insensitive'
                }
              }
            }
          },
          {
            referenceCode: {
              contains: query || '',
              mode: 'insensitive'
            }
          }
        ],
        status: status as any || undefined
      },
      include: {
        student: {
          include: {
            user: true
          }
        },
        lesson: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error searching payments:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}