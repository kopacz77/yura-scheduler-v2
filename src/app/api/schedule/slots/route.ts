import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { parse, format, addMinutes, addDays, parseISO, eachDayOfInterval } from 'date-fns';
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
    
    const rinkId = await ensureRinkExists(rinkName);
    const dateTimeString = `${date} ${startTime}`;
    const parsedDateTime = parse(dateTimeString, 'yyyy-MM-dd HH:mm', new Date());
    
    if (isNaN(parsedDateTime.getTime())) {
      throw new Error('Invalid date/time format');
    }

    const endDateTime = addMinutes(parsedDateTime, parseInt(duration));

    // Create single time slot
    const timeSlot = await prisma.rinkTimeSlot.create({
      data: {
        rinkId,
        startTime: parsedDateTime,
        endTime: endDateTime,
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
    const { 
      rinkId: rinkName, 
      startDate, 
      endDate, 
      startTime, 
      duration, 
      daysString, 
      maxStudents 
    } = data;

    const rinkId = await ensureRinkExists(rinkName);
    const selectedDays = daysString.split(',').map((day: string) => parseInt(day, 10));

    // Create recurring pattern
    const pattern = await prisma.recurringPattern.create({
      data: {
        rinkId,
        startDate: parseISO(startDate),
        endDate: parseISO(endDate),
        startTime,
        duration: parseInt(duration),
        daysOfWeek: selectedDays,
        maxStudents: parseInt(maxStudents),
        isActive: true,
      },
    });

    // Generate individual slot instances
    const dateRange = eachDayOfInterval({
      start: parseISO(startDate),
      end: parseISO(endDate),
    });

    const slotInstances = [];

    for (const date of dateRange) {
      if (selectedDays.includes(date.getDay())) {
        const slotStartTime = parse(startTime, 'HH:mm', date);
        const slotEndTime = addMinutes(slotStartTime, parseInt(duration));

        slotInstances.push({
          rinkId,
          startTime: slotStartTime,
          endTime: slotEndTime,
          maxStudents: parseInt(maxStudents),
          isActive: true,
          recurringId: pattern.id,
        });
      }
    }

    // Create all slot instances
    const createdSlots = await prisma.rinkTimeSlot.createMany({
      data: slotInstances,
    });

    return NextResponse.json({
      pattern,
      slotsCreated: createdSlots.count,
    });
  } catch (error) {
    console.error('[RECURRING_SLOTS_ERROR]', error);
    return new NextResponse(
      `Failed to create recurring slots: ${error.message}`, 
      { status: 500 }
    );
  }
}