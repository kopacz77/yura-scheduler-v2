import { Resend } from 'resend';
import { format } from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

const resend = new Resend(process.env.RESEND_API_KEY);

type NotificationData = {
  email: string;
  name: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  rinkName: string;
  rinkAddress: string;
};

type CancellationData = NotificationData & {
  reason?: string;
};

const formatDateTime = (date: Date, timeZone: string) => {
  return formatInTimeZone(date, timeZone, 'MMMM d, yyyy h:mm a');
};

export async function sendBookingConfirmation(data: NotificationData) {
  const timeZone = 'America/Los_Angeles';
  
  try {
    await resend.emails.send({
      from: 'Yura Min Academy <notifications@yuraminacademy.com>',
      to: data.email,
      subject: 'Lesson Booking Confirmation',
      text: `
Hello ${data.name},

Your skating lesson has been confirmed:

Date: ${format(data.date, 'MMMM d, yyyy')}
Time: ${formatDateTime(data.startTime, timeZone)} - ${formatDateTime(data.endTime, timeZone)}
Location: ${data.rinkName}
Address: ${data.rinkAddress}

Please arrive 15 minutes early to prepare.

Best regards,
Yura Min Academy
      `,
    });
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
    throw error;
  }
}

export async function sendCancellationNotice(data: CancellationData) {
  const timeZone = 'America/Los_Angeles';

  try {
    await resend.emails.send({
      from: 'Yura Min Academy <notifications@yuraminacademy.com>',
      to: data.email,
      subject: 'Lesson Cancellation Notice',
      text: `
Hello ${data.name},

Your skating lesson has been cancelled:

Date: ${format(data.date, 'MMMM d, yyyy')}
Time: ${formatDateTime(data.startTime, timeZone)} - ${formatDateTime(data.endTime, timeZone)}
Location: ${data.rinkName}
${data.reason ? `\nReason: ${data.reason}` : ''}

Please contact us if you have any questions.

Best regards,
Yura Min Academy
      `,
    });
  } catch (error) {
    console.error('Error sending cancellation notice:', error);
    throw error;
  }
}

export async function sendLessonReminder(data: NotificationData) {
  const timeZone = 'America/Los_Angeles';

  try {
    await resend.emails.send({
      from: 'Yura Min Academy <notifications@yuraminacademy.com>',
      to: data.email,
      subject: 'Upcoming Lesson Reminder',
      text: `
Hello ${data.name},

This is a reminder about your upcoming skating lesson:

Date: ${format(data.date, 'MMMM d, yyyy')}
Time: ${formatDateTime(data.startTime, timeZone)} - ${formatDateTime(data.endTime, timeZone)}
Location: ${data.rinkName}
Address: ${data.rinkAddress}

Please arrive 15 minutes early to prepare.

Best regards,
Yura Min Academy
      `,
    });
  } catch (error) {
    console.error('Error sending lesson reminder:', error);
    throw error;
  }
}