import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: {
        student: {
          include: {
            user: true
          }
        },
        lesson: true
      }
    });

    if (!payment) {
      return new NextResponse('Payment not found', { status: 404 });
    }

    // TODO: Implement email reminder
    // For now, just mark as reminded
    await prisma.payment.update({
      where: { id: params.id },
      data: {
        reminderSentAt: new Date()
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending payment reminder:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}