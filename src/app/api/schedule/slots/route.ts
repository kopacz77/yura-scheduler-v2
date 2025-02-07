import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { parse, format, addMinutes } from 'date-fns';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    console.log('Received data:', data); // Debug log

    if (data.type === 'recurring') {
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
    console.log('Processing single slot:', { date, startTime }); // Debug log

    // Ensure date is in correct format
    if (!date || !startTime) {
      throw new Error('Missing date or startTime');
    }

    // Parse the combined date and time
    const dateTimeString = `${date} ${startTime}`;
    console.log('Date time string:', dateTimeString); // Debug log

    const parsedDateTime = parse(dateTimeString, 'yyyy-MM-dd HH:mm', new Date());
    console.log('Parsed datetime:', parsedDateTime); // Debug log

    if (isNaN(parsedDateTime.getTime())) {
      throw new Error('Invalid date/time format');
    }

    // Calculate end time
    const endDateTime = addMinutes(parsedDateTime, parseInt(duration));

    // Format times for database
    const formattedStartTime = format(parsedDateTime, 'HH:mm');
    const formattedEndTime = format(endDateTime, 'HH:mm');

    const timeSlot = await prisma.rinkTimeSlot.create({
      data: {
        rinkId,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        daysOfWeek: [parsedDateTime.getDay()],
        maxStudents: parseInt(maxStudents),
        isActive: true,
      },
    });

    return NextResponse.json(timeSlot);
  } catch (error) {
    console.error('[SINGLE_SLOT_ERROR]', error);
    return new NextResponse(`Failed to create single slot: ${error.message}`, { status: 500 });
  }
}

async function handleRecurringSlots(data: any) {
  try {
    const { rinkId, startTime, endTime, daysString, maxStudents } = data;
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
    return new NextResponse(`Failed to create recurring slots: ${error.message}`, { status: 500 });
  }
}