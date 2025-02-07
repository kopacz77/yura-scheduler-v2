import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { addDays, setHours, setMinutes, parse } from 'date-fns';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    const { rinkId, type } = data;

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
  const { rinkId, date, startTime, duration, maxStudents } = data;

  const startDateTime = parse(
    `${date} ${startTime}`,
    'yyyy-MM-dd HH:mm',
    new Date()
  );

  const timeSlot = await prisma.rinkTimeSlot.create({
    data: {
      rinkId,
      startTime: startTime,
      endTime: addMinutes(startTime, parseInt(duration)).toISOString(),
      daysOfWeek: [startDateTime.getDay()],
      maxStudents: parseInt(maxStudents),
      isActive: true,
    },
  });

  return NextResponse.json(timeSlot);
}

async function handleRecurringSlots(data: any) {
  const {
    rinkId,
    startDate,
    endDate,
    daysOfWeek,
    timeRange,
    duration,
    maxStudents,
  } = data;

  const slots = daysOfWeek.split(',').map(Number);
  
  const timeSlot = await prisma.rinkTimeSlot.create({
    data: {
      rinkId,
      startTime: timeRange.start,
      endTime: timeRange.end,
      daysOfWeek: slots,
      maxStudents: parseInt(maxStudents),
      isActive: true,
    },
  });

  return NextResponse.json(timeSlot);
}

// Helper function to add minutes to a time string
function addMinutes(time: string, minutes: number): Date {
  const [hours, mins] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(mins + minutes);
  return date;
}