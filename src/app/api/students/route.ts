import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ApiResponse, CreateStudentRequest } from '@/types/api';
import { Student } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { 
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to view students'
          }
        } as ApiResponse<never>,
        { status: 401 }
      );
    }

    // Only fetch active students with role STUDENT
    const students = await prisma.student.findMany({
      where: {
        user: {
          role: 'STUDENT',
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
    });

    return NextResponse.json({ data: students } as ApiResponse<Student[]>);
  } catch (error) {
    console.error('[STUDENTS_GET]', error);
    return NextResponse.json(
      { 
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching students',
          details: process.env.NODE_ENV === 'development' ? error : undefined
        }
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { 
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to create students'
          }
        } as ApiResponse<never>,
        { status: 401 }
      );
    }

    const body = await req.json() as CreateStudentRequest;
    const { name, email, phone, emergencyContact } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields',
            details: {
              name: !name ? 'Name is required' : undefined,
              email: !email ? 'Email is required' : undefined,
              phone: !phone ? 'Phone is required' : undefined,
            }
          }
        } as ApiResponse<never>,
        { status: 400 }
      );
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
          },
        },
      },
    });

    revalidatePath('/students');
    return NextResponse.json({ data: student } as ApiResponse<Student>);
  } catch (error) {
    console.error('[STUDENTS_POST]', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating student',
          details: process.env.NODE_ENV === 'development' ? error : undefined
        }
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to update students'
          }
        } as ApiResponse<never>,
        { status: 401 }
      );
    }

    const { id, ...data } = await req.json();
    
    if (!id) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Student ID is required'
          }
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    const student = await prisma.student.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    revalidatePath('/students');
    return NextResponse.json({ data: student } as ApiResponse<Student>);
  } catch (error) {
    console.error('[STUDENTS_PATCH]', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while updating student',
          details: process.env.NODE_ENV === 'development' ? error : undefined
        }
      } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
