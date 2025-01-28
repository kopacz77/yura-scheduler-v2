import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const appointments = await db.query.appointment.findMany({
      include: {
        student: true,
        resource: true,
      },
      orderBy: {
        start: 'asc',
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { title, start, end, studentId, resourceId, lessonType, notes } = body;

    const appointment = await db.query.appointment.create({
      data: {
        title,
        start: new Date(start),
        end: new Date(end),
        studentId,
        resourceId,
        lessonType,
        notes,
        order: 0, // Default order
        paymentStatus: 'PENDING',
      },
    });

    // Send email notification
    const student = await db.query.student.findUnique({
      where: { id: studentId },
    });

    if (student?.email) {
      await sendAppointmentEmail({
        to: student.email,
        subject: 'New Lesson Scheduled',
        appointment,
        studentName: student.name,
      });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    const appointment = await db.query.appointment.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Missing ID', { status: 400 });
    }

    await db.query.appointment.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
