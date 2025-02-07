import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = params;

    // Check if slot exists
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

    // Delete the slot
    await prisma.rinkTimeSlot.delete({
      where: { id }
    });

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

    // Check if slot exists
    const slot = await prisma.rinkTimeSlot.findUnique({
      where: { id }
    });

    if (!slot) {
      return new NextResponse('Slot not found', { status: 404 });
    }

    // Update the slot
    const updatedSlot = await prisma.rinkTimeSlot.update({
      where: { id },
      data: {
        startTime: data.startTime,
        endTime: data.endTime,
        daysOfWeek: data.daysOfWeek,
        maxStudents: data.maxStudents,
        isActive: data.isActive
      }
    });

    return NextResponse.json(updatedSlot);
  } catch (error) {
    console.error('[SLOT_UPDATE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}