import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const referenceCode = searchParams.get('referenceCode');

    if (!referenceCode) {
      return NextResponse.json(
        { error: 'Reference code is required' },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { referenceCode },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        lesson: {
          select: {
            startTime: true,
            duration: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ payment });
  } catch (error) {
    console.error('Error searching payment:', error);
    return NextResponse.json(
      { error: 'Failed to search payment' },
      { status: 500 }
    );
  }
}
