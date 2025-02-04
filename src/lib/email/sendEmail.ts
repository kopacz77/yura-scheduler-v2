import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ 
  to, 
  subject, 
  html 
}: { 
  to: string; 
  subject: string; 
  html: string; 
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set');
    return { success: false, error: 'API key not configured' };
  }

  try {
    const data = await resend.emails.send({
      from: 'YM Movement <notifications@ymmove.com>',
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export async function sendLessonReminder(to: string, lesson: any) {
  return sendEmail({
    to,
    subject: 'Upcoming Lesson Reminder',
    html: `<p>You have an upcoming lesson on ${lesson.date}...</p>`,
  });
}

export async function sendPaymentReminder(to: string, payment: any) {
  return sendEmail({
    to,
    subject: 'Payment Reminder',
    html: `<p>You have a pending payment of ${payment.amount}...</p>`,
  });
}