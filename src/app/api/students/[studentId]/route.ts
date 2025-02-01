import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params.studentId) {
      return new NextResponse('Student ID is required', { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: {
        id: params.studentId,
      },
      include: {
        user: true,
        lessons: {
          orderBy: {
            startTime: 'desc',
          },
        },
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error('[STUDENT_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, email, phone, emergencyContact, maxLessonsPerWeek, notes } = body;

    if (!params.studentId) {
      return new NextResponse('Student ID is required', { status: 400 });
    }

    // Update user information
    await prisma.user.update({
      where: {
        id: params.studentId,
      },
      data: {
        name,
        email,
      },
    });

    // Update student information
    const updatedStudent = await prisma.student.update({
      where: {
        id: params.studentId,
      },
      data: {
        phone,
        emergencyContact,
        maxLessonsPerWeek,
        notes,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error('[STUDENT_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { studentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params.studentId) {
      return new NextResponse('Student ID is required', { status: 400 });
    }

    // This will cascade delete the student and associated user
    const deletedStudent = await prisma.student.delete({
      where: {
        id: params.studentId,
      },
    });

    return NextResponse.json(deletedStudent);
  } catch (error) {
    console.error('[STUDENT_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
