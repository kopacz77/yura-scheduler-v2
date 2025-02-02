import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const rinkId = searchParams.get('rinkId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const lessons = await prisma.lesson.findMany({
      where: {
        studentId: studentId || undefined,
        rinkId: rinkId || undefined,
        startTime: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        rink: true,
        timeSlot: true,
        payment: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    
    // Verify time slot availability
    const existingLessons = await prisma.lesson.count({
      where: {
        timeSlotId: data.timeSlotId,
        startTime: data.startTime,
        endTime: data.endTime,
        status: 'SCHEDULED',
      },
    });

    const timeSlot = await prisma.rinkTimeSlot.findUnique({
      where: { id: data.timeSlotId },
    });

    if (!timeSlot || existingLessons >= timeSlot.maxStudents) {
      return new NextResponse('Time slot not available', { status: 400 });
    }

    // Create lesson with associated payment
    const lesson = await prisma.lesson.create({
      data: {
        studentId: data.studentId,
        rinkId: data.rinkId,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        duration: data.duration,
        status: 'SCHEDULED',
        notes: data.notes,
        price: data.price,
        timeSlotId: data.timeSlotId,
        payment: {
          create: {
            studentId: data.studentId,
            amount: data.price,
            method: data.paymentMethod,
            status: 'PENDING',
            referenceCode: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          },
        },
      },
      include: {
        student: true,
        rink: true,
        payment: true,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error creating lesson:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    const { id, ...updateData } = data;

    const lesson = await prisma.lesson.update({
      where: { id },
      data: updateData,
      include: {
        student: true,
        rink: true,
        payment: true,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}