import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email/sendEmail';
import { getServerSession } from 'next-auth';

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Check admin authorization
    const session = await getServerSession();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId } = params;

    // Get user details before deletion
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { student: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete user and associated student profile
    await prisma.user.delete({
      where: { id: userId },
    });

    // Send rejection email
    await sendEmail({
      to: user.email,
      subject: 'Yura Ice Dance - Registration Status',
      html: `
        <h1>Registration Status Update</h1>
        <p>Dear ${user.name},</p>
        <p>Thank you for your interest in Yura Ice Dance. After reviewing your registration, we regret to inform you that we cannot approve your account at this time.</p>
        <p>This decision may be due to various factors, including:</p>
        <ul>
          <li>Current class capacity</li>
          <li>Skill level requirements</li>
          <li>Age restrictions</li>
        </ul>
        <p>If you would like to discuss this further or reapply in the future, please feel free to contact us.</p>
        <p>Best regards,<br>Yura Min</p>
      `,
    });

    return NextResponse.json({
      message: 'User rejected successfully',
    });
  } catch (error) {
    console.error('Error rejecting user:', error);
    return NextResponse.json(
      { error: 'Failed to reject user' },
      { status: 500 }
    );
  }
}