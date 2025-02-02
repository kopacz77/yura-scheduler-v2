import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    const { paymentId, verificationNotes } = data;

    // Start a transaction
    const payment = await prisma.$transaction(async (prisma) => {
      // Update payment status
      const updatedPayment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'COMPLETED',
          verifiedBy: session.user.id,
          verifiedAt: new Date(),
          notes: verificationNotes,
        },
        include: {
          lesson: true,
          student: true,
        },
      });

      // If there's an associated lesson, update its status
      if (updatedPayment.lessonId) {
        await prisma.lesson.update({
          where: { id: updatedPayment.lessonId },
          data: {
            status: 'SCHEDULED',
          },
        });
      }

      return updatedPayment;
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error verifying payment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}