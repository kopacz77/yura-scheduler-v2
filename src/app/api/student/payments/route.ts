import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { userId: session.user.id },
    });

    if (!student) {
      return new NextResponse('Student not found', { status: 404 });
    }

    const payments = await prisma.payment.findMany({
      where: { studentId: student.id },
      include: {
        lesson: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching student payments:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}