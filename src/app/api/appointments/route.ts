import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Role, LessonStatus } from '@prisma/client';

export { dynamic, revalidate } from '../config';

// GET - Fetch appointments
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const url = new URL(req.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const studentId = url.searchParams.get('studentId');
    const status = url.searchParams.get('status') as LessonStatus;

    // Base query
    const where: any = {};

    // Add date filters if provided
    if (startDate) {
      where.startTime = { gte: new Date(startDate) };
    }
    if (endDate) {
      where.endTime = { lte: new Date(endDate) };
    }
    if (status) {
      where.status = status;
    }

    // Filter by role
    if (session.user.role === Role.STUDENT) {
      where.studentId = session.user.id;
    } else if (session.user.role === Role.ADMIN && studentId) {
      where.studentId = studentId;
    }

    const appointments = await prisma.lesson.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true
              }
            },
            phone: true,
            level: true
          }
        },
        rink: true,
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch appointments' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST - Create new appointment
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { studentId, rinkId, startTime, endTime, type, area, price, notes } = body;

    // Validate required fields
    if (!studentId || !rinkId || !startTime || !endTime || !type || !area || !price) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check for scheduling conflicts
    const conflictingLesson = await prisma.lesson.findFirst({
      where: {
        OR: [
          {
            startTime: { lte: new Date(startTime) },
            endTime: { gt: new Date(startTime) }
          },
          {
            startTime: { lt: new Date(endTime) },
            endTime: { gte: new Date(endTime) }
          }
        ],
        AND: [
          { rinkId },
          { area },
          { status: 'SCHEDULED' }
        ]
      }
    });

    if (conflictingLesson) {
      return new NextResponse(
        JSON.stringify({ error: 'Time slot is already booked' }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const appointment = await prisma.lesson.create({
      data: {
        studentId,
        rinkId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration: Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000),
        type,
        area,
        price,
        notes,
        status: 'SCHEDULED'
      },
      include: {
        student: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true
              }
            },
            phone: true,
            level: true
          }
        },
        rink: true
      }
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create appointment' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// PATCH - Update appointment
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: 'Appointment ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has permission to update
    const existingAppointment = await prisma.lesson.findUnique({
      where: { id },
      include: { student: true }
    });

    if (!existingAppointment) {
      return new NextResponse(
        JSON.stringify({ error: 'Appointment not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (session.user.role !== Role.ADMIN && existingAppointment.studentId !== session.user.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Not authorized to update this appointment' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If updating time, check for conflicts
    if (updateData.startTime || updateData.endTime) {
      const startTime = updateData.startTime || existingAppointment.startTime;
      const endTime = updateData.endTime || existingAppointment.endTime;

      const conflictingLesson = await prisma.lesson.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            { rinkId: existingAppointment.rinkId },
            { area: existingAppointment.area },
            { status: 'SCHEDULED' },
            {
              OR: [
                {
                  startTime: { lte: new Date(startTime) },
                  endTime: { gt: new Date(startTime) }
                },
                {
                  startTime: { lt: new Date(endTime) },
                  endTime: { gte: new Date(endTime) }
                }
              ]
            }
          ]
        }
      });

      if (conflictingLesson) {
        return new NextResponse(
          JSON.stringify({ error: 'New time slot is already booked' }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Update duration if times are changing
      updateData.duration = Math.round(
        (new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000
      );
    }

    const appointment = await prisma.lesson.update({
      where: { id },
      data: updateData,
      include: {
        student: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true
              }
            },
            phone: true,
            level: true
          }
        },
        rink: true
      }
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to update appointment' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// DELETE - Cancel appointment
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const reason = url.searchParams.get('reason');

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: 'Appointment ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has permission to cancel
    const existingAppointment = await prisma.lesson.findUnique({
      where: { id },
      include: { student: true }
    });

    if (!existingAppointment) {
      return new NextResponse(
        JSON.stringify({ error: 'Appointment not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (session.user.role !== Role.ADMIN && existingAppointment.studentId !== session.user.id) {
      return new NextResponse(
        JSON.stringify({ error: 'Not authorized to cancel this appointment' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const appointment = await prisma.lesson.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancellationReason: reason || 'No reason provided',
        cancellationTime: new Date()
      },
      include: {
        student: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true
              }
            },
            phone: true,
            level: true
          }
        },
        rink: true
      }
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to cancel appointment' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}