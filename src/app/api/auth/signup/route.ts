import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email/sendEmail';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      level,
      emergencyName,
      emergencyPhone,
      relationship,
    } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user and student profile
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash: hashedPassword,
        status: 'PENDING_APPROVAL',
        student: {
          create: {
            name,
            email,
            phone,
            level,
            emergencyName,
            emergencyPhone,
            relationship,
          },
        },
      },
    });

    // Send notification to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: 'New Student Registration',
      html: `
        <h1>New Student Registration</h1>
        <p>A new student has registered and is pending approval:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Level:</strong> ${level}</li>
        </ul>
        <p>Please log in to the admin dashboard to review and approve this registration.</p>
      `,
    });

    return NextResponse.json({
      message: 'User created successfully',
      userId: user.id,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}