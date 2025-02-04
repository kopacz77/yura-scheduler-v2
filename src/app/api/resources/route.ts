import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const rink = await prisma.rink.findUnique({
        where: { id },
        include: {
          lessons: {
            where: {
              startTime: { gte: new Date() }
            }
          },
          timeSlots: {
            where: { isActive: true }
          }
        }
      });

      if (!rink) {
        return new NextResponse('Resource not found', { status: 404 });
      }

      return NextResponse.json(rink);
    }

    const rinks = await prisma.rink.findMany({
      include: {
        timeSlots: {
          where: { isActive: true }
        },
        _count: {
          select: { lessons: true }
        }
      }
    });

    return NextResponse.json(rinks);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}