import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const students = await db.query.student.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, level, emergencyName, emergencyPhone, notes } = body;

    // Check if student with email already exists
    const existingStudent = await db.query.student.findUnique({
      where: { email },
    });

    if (existingStudent) {
      return new NextResponse('Student with this email already exists', { status: 400 });
    }

    const student = await db.query.student.create({
      data: {
        name,
        email,
        phone,
        level,
        emergencyName,
        emergencyPhone,
        notes,
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error('Error creating student:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new NextResponse('Missing student ID', { status: 400 });
    }

    const body = await req.json();
    const { name, email, phone, level, emergencyName, emergencyPhone, notes } = body;

    // If email is being changed, check it's not taken
    if (email) {
      const existingStudent = await db.query.student.findFirst({
        where: {
          email,
          id: { not: id },
        },
      });

      if (existingStudent) {
        return new NextResponse('Email already in use', { status: 400 });
      }
    }

    const student = await db.query.student.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        level,
        emergencyName,
        emergencyPhone,
        notes,
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Missing student ID', { status: 400 });
    }

    // Check for existing appointments
    const existingAppointments = await db.query.appointment.findMany({
      where: { studentId: id },
    });

    if (existingAppointments.length > 0) {
      return new NextResponse('Cannot delete student with existing appointments', { status: 400 });
    }

    await db.query.student.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting student:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
