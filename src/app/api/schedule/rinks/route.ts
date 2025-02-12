import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const rinks = await prisma.rink.findMany({
      select: {
        id: true,
        name: true,
        timezone: true,
        address: true,
        maxCapacity: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(rinks);
  } catch (error) {
    console.error('Error fetching rinks:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}