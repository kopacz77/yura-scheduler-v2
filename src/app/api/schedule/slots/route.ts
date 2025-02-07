import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { addDays, setHours, setMinutes, parse, format, addMinutes } from 'date-fns';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    const { type } = data;

    if (type === 'recurring') {
      return await handleRecurringSlots(data);
    } else {
      return await handleSingleSlot(data);
    }
  } catch (error) {
    console.error('[SLOTS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

async function handleSingleSlot(data: any) {
  try {
    const { rinkId, date, startTime, duration, maxStudents } = data;

    // Parse the date and time into a Date object
    const parsedStartTime = parse(
      `${date} ${startTime}`,
      'yyyy-MM-dd HH:mm',
      new Date()
    );

    // Calculate end time
    const parsedEndTime = addMinutes(parsedStartTime, parseInt(duration));

    // Create time slot with parsed times
    const timeSlot = await prisma.rinkTimeSlot.create({
      data: {
        rinkId,
        startTime: format(parsedStartTime, 'HH:mm'),
        endTime: format(parsedEndTime, 'HH:mm'),
        daysOfWeek: [parsedStartTime.getDay()],
        maxStudents: parseInt(maxStudents),
        isActive: true,
      },
    });

    return NextResponse.json(timeSlot);
  } catch (error) {
    console.error('[SINGLE_SLOT_ERROR]', error);
    return new NextResponse('Failed to create single slot', { status: 500 });
  }
}

async function handleRecurringSlots(data: any) {
  try {
    const {
      rinkId,
      startDate,
      endDate,
      startTime,
      endTime,
      daysString,
      maxStudents
    } = data;

    // Parse days string into array of numbers
    const daysOfWeek = daysString.split(',').map((day: string) => parseInt(day, 10));

    const timeSlot = await prisma.rinkTimeSlot.create({
      data: {
        rinkId,
        startTime,
        endTime,
        daysOfWeek,
        maxStudents: parseInt(maxStudents),
        isActive: true,
      },
    });

    return NextResponse.json(timeSlot);
  } catch (error) {
    console.error('[RECURRING_SLOTS_ERROR]', error);
    return new NextResponse('Failed to create recurring slots', { status: 500 });
  }
}