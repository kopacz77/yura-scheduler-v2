import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { addDays, setHours, setMinutes, parse, addMinutes } from 'date-fns';

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
  const { rinkId, date, startTime, duration, maxStudents } = data;

  // Parse the start time into a Date object
  const startDate = parse(
    `${date} ${startTime}`,
    'yyyy-MM-dd HH:mm',
    new Date()
  );

  // Calculate end time by adding duration minutes
  const endDate = addMinutes(startDate, parseInt(duration));

  // Format times for database
  const formattedStartTime = format(startDate, 'HH:mm');
  const formattedEndTime = format(endDate, 'HH:mm');

  const timeSlot = await prisma.rinkTimeSlot.create({
    data: {
      rinkId,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      daysOfWeek: [startDate.getDay()],
      maxStudents: parseInt(maxStudents),
      isActive: true,
    },
  });

  return NextResponse.json(timeSlot);
}

async function handleRecurringSlots(data: any) {
  const {
    rinkId,
    daysString,
    startTime,
    endTime,
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
}

// Create the schedule API route to handle the 404 error
const scheduleApiRoute = `${process.env.NEXTAUTH_URL}/api/schedule`;
export { scheduleApiRoute };