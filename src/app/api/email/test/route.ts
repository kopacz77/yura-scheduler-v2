import { NextResponse } from 'next/server';
import { Email } from '@/components/email/templates/test';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const data = await resend.emails.send({
      from: 'YM Movement <no-reply@ymmove.com>',
      to: ['test@example.com'],
      subject: 'Test Email',
      react: Email({ firstName: 'Test' }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}