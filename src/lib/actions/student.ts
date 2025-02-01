import { prisma } from '@/lib/prisma';

export interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  maxLessonsPerWeek?: number;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  notes?: string;
}

export async function createStudent(data: StudentFormData) {
  'use server';

  try {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        role: 'STUDENT',
      },
    });

    const student = await prisma.student.create({
      data: {
        userId: user.id,
        phone: data.phone,
        maxLessonsPerWeek: data.maxLessonsPerWeek || 3,
        emergencyContact: data.emergencyContact,
        notes: data.notes,
      },
      include: {
        user: true,
      },
    });

    return { success: true, data: student };
  } catch (error) {
    console.error('[CREATE_STUDENT_ERROR]', error);
    return { success: false, error: 'Failed to create student' };
  }
}

export async function updateStudent(id: string, data: Partial<StudentFormData>) {
  'use server';

  try {
    const student = await prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!student) {
      return { success: false, error: 'Student not found' };
    }

    // Update user information if provided
    if (data.name || data.email) {
      await prisma.user.update({
        where: { id: student.userId },
        data: {
          name: data.name,
          email: data.email,
        },
      });
    }

    // Update student information
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        phone: data.phone,
        maxLessonsPerWeek: data.maxLessonsPerWeek,
        emergencyContact: data.emergencyContact,
        notes: data.notes,
      },
      include: {
        user: true,
      },
    });

    return { success: true, data: updatedStudent };
  } catch (error) {
    console.error('[UPDATE_STUDENT_ERROR]', error);
    return { success: false, error: 'Failed to update student' };
  }
}

export async function deleteStudent(id: string) {
  'use server';

  try {
    await prisma.student.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error('[DELETE_STUDENT_ERROR]', error);
    return { success: false, error: 'Failed to delete student' };
  }
}

export async function getStudentDetails(id: string) {
  'use server';

  try {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
        lessons: {
          orderBy: {
            startTime: 'desc',
          },
          include: {
            rink: true,
          },
        },
      },
    });

    if (!student) {
      return { success: false, error: 'Student not found' };
    }

    return { success: true, data: student };
  } catch (error) {
    console.error('[GET_STUDENT_DETAILS_ERROR]', error);
    return { success: false, error: 'Failed to fetch student details' };
  }
}
