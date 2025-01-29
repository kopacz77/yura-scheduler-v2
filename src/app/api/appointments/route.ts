import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { validateAppointments, generateRecurringAppointments } from '@/lib/scheduling/conflicts';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const resourceId = searchParams.get('resourceId');

    const appointments = await prisma.appointment.findMany({
      where: {
        ...(startDate && endDate ? {
          start: { gte: new Date(startDate) },
          end: { lte: new Date(endDate) }
        } : {}),
        ...(resourceId ? { resourceId } : {})
      },
      include: {
        student: true,
        resource: true,
        payment: true
      }
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const {
      appointment,
      isRecurring,
      recurrencePattern,
      recurrenceEndDate
    } = body;

    // Generate appointments based on recurrence pattern
    const appointmentsToCreate = isRecurring
      ? generateRecurringAppointments(
          appointment,
          recurrencePattern,
          new Date(recurrenceEndDate)
        )
      : [appointment];

    // Validate appointments for conflicts
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        resourceId: appointment.resourceId,
        start: { gte: new Date(appointment.start) },
        end: { lte: isRecurring ? new Date(recurrenceEndDate) : new Date(appointment.end) }
      }
    });

    const resources = await prisma.resource.findMany({
      where: { id: appointment.resourceId }
    });

    const validation = await validateAppointments(
      appointmentsToCreate,
      existingAppointments,
      resources
    );

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Scheduling conflicts detected', conflicts: validation.conflicts },
        { status: 409 }
      );
    }

    // Create all appointments
    const createdAppointments = await prisma.$transaction(
      appointmentsToCreate.map(appt =>
        prisma.appointment.create({
          data: appt,
          include: {
            student: true,
            resource: true
          }
        })
      )
    );

    return NextResponse.json(createdAppointments);
  } catch (error) {
    console.error('Error creating appointments:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    // Check for conflicts before updating
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        resourceId: updateData.resourceId,
        NOT: { id },
        start: { gte: new Date(updateData.start) },
        end: { lte: new Date(updateData.end) }
      }
    });

    const resources = await prisma.resource.findMany({
      where: { id: updateData.resourceId }
    });

    const validation = await validateAppointments(
      [updateData],
      existingAppointments,
      resources
    );

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Scheduling conflicts detected', conflicts: validation.conflicts },
        { status: 409 }
      );
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        student: true,
        resource: true,
        payment: true
      }
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return new NextResponse('Missing appointment ID', { status: 400 });
    }

    // Check if this is part of a recurring series
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { payment: true }
    });

    if (!appointment) {
      return new NextResponse('Appointment not found', { status: 404 });
    }

    // If there's a payment associated, handle it appropriately
    if (appointment.payment) {
      // You might want to refund or mark the payment as cancelled
      await prisma.payment.update({
        where: { id: appointment.payment.id },
        data: { status: 'CANCELLED' }
      });
    }

    // Delete the appointment
    await prisma.appointment.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
