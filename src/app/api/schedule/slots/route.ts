import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { parseISO, addMinutes, eachDayOfInterval, isSameDay, startOfDay, endOfDay, set } from 'date-fns';
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

async function checkOverlappingSlots(rinkId: string, startTime: Date, endTime: Date) {
  const overlapping = await prisma.rinkTimeSlot.findFirst({
    where: {
      rinkId,
      OR: [
        {
          AND: [
            { startTime: { lte: startTime } },
            { endTime: { gt: startTime } }
          ]
        },
        {
          AND: [
            { startTime: { lt: endTime } },
            { endTime: { gte: endTime } }
          ]
        }
      ]
    }
  });

  return overlapping !== null;
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
    
    if (!date || !startTime || !duration) {
      throw new Error('Missing required fields');
    }

    const rinkId = await ensureRinkExists(rinkName);

    // Parse the date and time
    const baseDate = parseISO(date);
    const [hours, minutes] = startTime.split(':').map(Number);
    
    // Create the full start time
    const slotStartTime = set(baseDate, { hours, minutes, seconds: 0, milliseconds: 0 });
    const slotEndTime = addMinutes(slotStartTime, parseInt(duration));

    // Check for overlapping slots
    const hasOverlap = await checkOverlappingSlots(rinkId, slotStartTime, slotEndTime);
    if (hasOverlap) {
      throw new Error('Time slot overlaps with an existing slot');
    }

    // Create the slot
    const timeSlot = await prisma.rinkTimeSlot.create({
      data: {
        rinkId,
        startTime: slotStartTime,
        endTime: slotEndTime,
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

    if (!startDate || !endDate || !startTime || !duration || !daysString) {
      throw new Error('Missing required fields');
    }

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

    const [hours, minutes] = startTime.split(':').map(Number);
    const slotInstances = [];

    for (const date of dateRange) {
      if (selectedDays.includes(date.getDay())) {
        const slotStartTime = set(date, { hours, minutes, seconds: 0, milliseconds: 0 });
        const slotEndTime = addMinutes(slotStartTime, parseInt(duration));

        // Check for overlaps
        const hasOverlap = await checkOverlappingSlots(rinkId, slotStartTime, slotEndTime);
        if (!hasOverlap) {
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
    }

    // Create all valid slot instances
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