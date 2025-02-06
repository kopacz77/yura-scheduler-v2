import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const students = await prisma.student.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        user: {
          name: 'asc'
        }
      }
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('[STUDENTS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, email, phone, emergencyContact } = body;

    if (!name || !email || !phone) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // First create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: 'STUDENT',
      },
    });

    // Then create the student profile
    const student = await prisma.student.create({
      data: {
        userId: user.id,
        phone,
        emergencyContact,
        maxLessonsPerWeek: 3, // Default value
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error('[STUDENTS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
