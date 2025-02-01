import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const students = await prisma.student.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
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
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Error fetching students' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { email, name, phone, maxLessonsPerWeek, emergencyContact } = data;

    // Create user and student in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          email,
          name,
          role: 'STUDENT',
        },
      });

      const student = await prisma.student.create({
        data: {
          userId: user.id,
          phone,
          maxLessonsPerWeek: maxLessonsPerWeek || 3,
          emergencyContact: emergencyContact || null,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });

      return student;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Error creating student' },
      { status: 500 }
    );
  }
}
