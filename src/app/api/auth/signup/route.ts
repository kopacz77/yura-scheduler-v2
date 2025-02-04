import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { validateUser, validateAdminAction } from '@/lib/utils/validation';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = validateUser(body);

    if (!validation.success) {
      return new NextResponse(validation.error.message, { status: 400 });
    }

    const { email, password, name, role } = validation.data;

    // Prevent creation of admin accounts without proper authorization
    if (role === 'ADMIN') {
      const adminValidation = await validateAdminAction(body);
      if (!adminValidation.success) {
        return new NextResponse('Unauthorized admin account creation', { status: 403 });
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse('User with this email already exists', { status: 400 });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user transaction with associated profile
    const user = await prisma.$transaction(async (prisma) => {
      // Create user
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role,
          emailVerified: null, // Will be set after email verification
        },
      });

      // If it's a student, create student profile
      if (role === 'STUDENT') {
        await prisma.student.create({
          data: {
            userId: newUser.id,
            maxLessonsPerWeek: 3, // Default value
          },
        });

        // Send verification email (implementation in next step)
        await sendVerificationEmail(newUser.email, newUser.id);
      }

      return newUser;
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Signup error:', error);
    return new NextResponse(
      'An error occurred while creating your account',
      { status: 500 }
    );
  }
}

async function sendVerificationEmail(email: string, userId: string) {
  // Will implement in next step
  // This will use the email service to send verification links
}
