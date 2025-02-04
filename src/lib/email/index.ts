import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const data = await resend.emails.send({
      from: 'YM Movement <no-reply@ymmove.com>',
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

export async function sendLessonReminder(to: string, lessonDetails: any) {
  return sendEmail({
    to,
    subject: 'Upcoming Lesson Reminder',
    html: `<p>You have an upcoming lesson...</p>`, // Expand this template
  });
}

export async function sendPaymentReminder(to: string, paymentDetails: any) {
  return sendEmail({
    to,
    subject: 'Payment Reminder',
    html: `<p>Payment reminder...</p>`, // Expand this template
  });
}