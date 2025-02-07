import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { parse, format, addMinutes } from 'date-fns';
import { DEFAULT_RINKS } from '@/config/rinks';

async function ensureRinkExists(rinkName: string) {
  const rinkDetails = DEFAULT_RINKS[rinkName];
  if (!rinkDetails) throw new Error('Invalid rink name');

  let rink = await prisma.rink.findUnique({
    where: { name: rinkName },
  });

  if (!rink) {
    rink = await prisma.rink.create({
      data: {
        name: rinkName,
        timezone: rinkDetails.timezone,
        address: rinkDetails.address,
        maxCapacity: rinkDetails.maxCapacity,
      },
    });
  }

  return rink.id;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    console.log('Received data:', data);

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
    const { rinkId: rinkName, date, startTime, duration, maxStudents } = data;
    console.log('Processing single slot:', { date, startTime });

    const rinkId = await ensureRinkExists(rinkName);

    const dateTimeString = `${date} ${startTime}`;
    console.log('Date time string:', dateTimeString);

    const parsedDateTime = parse(dateTimeString, 'yyyy-MM-dd HH:mm', new Date());
    console.log('Parsed datetime:', parsedDateTime);

    if (isNaN(parsedDateTime.getTime())) {
      throw new Error('Invalid date/time format');
    }

    const endDateTime = addMinutes(parsedDateTime, parseInt(duration));

    // Store actual dates instead of just time
    const timeSlot = await prisma.rinkTimeSlot.create({
      data: {
        rinkId,
        startTime: format(parsedDateTime, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        endTime: format(endDateTime, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
        daysOfWeek: [parsedDateTime.getDay()],
        maxStudents: parseInt(maxStudents),
        isActive: true,
      },
    });

    return NextResponse.json(timeSlot);
  } catch (error) {
    console.error('[SINGLE_SLOT_ERROR]', error);
    return new NextResponse(
      `Failed to create single slot: ${error.message}`, 
      { status: 500 }
    );
  }
}

async function handleRecurringSlots(data: any) {
  try {
    const { rinkId: rinkName, startTime, endTime, daysString, maxStudents } = data;
    const rinkId = await ensureRinkExists(rinkName);
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
    return new NextResponse(
      `Failed to create recurring slots: ${error.message}`, 
      { status: 500 }
    );
  }
}