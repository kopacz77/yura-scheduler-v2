import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { parseISO } from 'date-fns';

// Validation helpers
async function checkOverlappingSlots(rinkId: string, startTime: Date, endTime: Date, excludeId?: string) {
  const overlapping = await prisma.rinkTimeSlot.findFirst({
    where: {
      rinkId,
      id: { not: excludeId },
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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = params;
    const { searchParams } = new URL(req.url);
    const deleteRecurring = searchParams.get('recurring') === 'true';

    const slot = await prisma.rinkTimeSlot.findUnique({
      where: { id },
      include: {
        lessons: true
      }
    });

    if (!slot) {
      return new NextResponse('Slot not found', { status: 404 });
    }

    // Check if slot has any lessons
    if (slot.lessons.length > 0) {
      return new NextResponse('Cannot delete slot with existing lessons', { status: 400 });
    }

    if (deleteRecurring && slot.recurringId) {
      // Delete all future instances of this recurring slot
      await prisma.rinkTimeSlot.deleteMany({
        where: {
          recurringId: slot.recurringId,
          startTime: { gte: slot.startTime }
        }
      });
    } else {
      // Delete single slot
      await prisma.rinkTimeSlot.delete({
        where: { id }
      });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[SLOT_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = params;
    const data = await req.json();
    const { startTime, endTime, maxStudents, updateRecurring } = data;

    const slot = await prisma.rinkTimeSlot.findUnique({
      where: { id },
      include: { rink: true }
    });

    if (!slot) {
      return new NextResponse('Slot not found', { status: 404 });
    }

    // Parse dates
    const newStartTime = startTime ? parseISO(startTime) : undefined;
    const newEndTime = endTime ? parseISO(endTime) : undefined;

    // Check for overlapping slots if times are being modified
    if (newStartTime && newEndTime) {
      const hasOverlap = await checkOverlappingSlots(
        slot.rinkId,
        newStartTime,
        newEndTime,
        id
      );

      if (hasOverlap) {
        return new NextResponse('Time slot overlaps with existing slot', { status: 400 });
      }
    }

    if (updateRecurring && slot.recurringId) {
      // Update all future instances of this recurring slot
      await prisma.rinkTimeSlot.updateMany({
        where: {
          recurringId: slot.recurringId,
          startTime: { gte: slot.startTime }
        },
        data: {
          maxStudents: maxStudents ? parseInt(maxStudents) : undefined,
        }
      });

      return NextResponse.json({ message: 'Recurring slots updated' });
    } else {
      // Update single slot
      const updatedSlot = await prisma.rinkTimeSlot.update({
        where: { id },
        data: {
          startTime: newStartTime,
          endTime: newEndTime,
          maxStudents: maxStudents ? parseInt(maxStudents) : undefined,
        }
      });

      return NextResponse.json(updatedSlot);
    }
  } catch (error) {
    console.error('[SLOT_UPDATE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}