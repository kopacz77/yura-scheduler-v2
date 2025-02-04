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
    const rinkId = searchParams.get('rinkId');
    const date = searchParams.get('date');
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');

    if (!date) {
      return new NextResponse('Date is required', { status: 400 });
    }

    // If looking for specific rink availability
    if (rinkId) {
      const rink = await prisma.rink.findUnique({
        where: { id: rinkId },
        include: { timeSlots: true }
      });

      if (!rink) {
        return new NextResponse('Rink not found', { status: 404 });
      }

      const lessons = await prisma.lesson.findMany({
        where: {
          rinkId,
          startTime: {
            gte: new Date(date)
          },
          endTime: {
            lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
          }
        }
      });

      // Find available time slots for the day
      const dayOfWeek = new Date(date).getDay();
      const availableTimeSlots = rink.timeSlots.filter(slot => 
        slot.isActive && slot.daysOfWeek.includes(dayOfWeek)
      );

      return NextResponse.json({
        rink,
        timeSlots: availableTimeSlots,
        lessons
      });
    }

    // If looking for all available rinks for a time slot
    if (startTime && endTime) {
      const rinks = await prisma.rink.findMany({
        include: { 
          timeSlots: true,
          lessons: {
            where: {
              startTime: { lte: new Date(endTime) },
              endTime: { gte: new Date(startTime) }
            }
          }
        }
      });

      const availableRinks = rinks.filter(rink => {
        if (rink.maxCapacity) {
          return rink.lessons.length < rink.maxCapacity;
        }
        return true;
      });

      return NextResponse.json(availableRinks);
    }

    return new NextResponse('Invalid request parameters', { status: 400 });
  } catch (error) {
    console.error('Error checking rink availability:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}