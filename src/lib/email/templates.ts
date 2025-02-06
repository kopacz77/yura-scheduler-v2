import { format } from 'date-fns';
import { PaymentMethod } from '@prisma/client';

export function generateReferenceCode(studentName: string, date: Date): string {
  const firstName = studentName.split(' ')[0].toUpperCase();
  const monthDay = format(date, 'MMMd').toUpperCase();
  const time = format(date, 'HHmm');
  return `${firstName}-${monthDay}-${time}`;
}

interface EmailData {
  studentName: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  location: string;
  address: string;
  duration: number;
  price: number;
  paymentMethod?: PaymentMethod;
  referenceCode?: string;
}

export const emailTemplates = {
  bookingConfirmation: (data: EmailData) => ({
    subject: `Lesson Confirmation: Ice Dance Lesson - ${data.studentName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Your ${data.duration}-Minute Lesson is Confirmed!</h1>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Lesson Details</h2>
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 10px;">📅 <strong>Date:</strong> ${format(data.date, 'EEEE, MMMM d, yyyy')}</li>
            <li style="margin-bottom: 10px;">⏰ <strong>Time:</strong> ${format(data.startTime, 'h:mm a')} - ${format(data.endTime, 'h:mm a')}</li>
            <li style="margin-bottom: 10px;">📍 <strong>Location:</strong> ${data.location}</li>
            <li style="margin-bottom: 10px;">📝 <strong>Address:</strong> ${data.address}</li>
            <li style="margin-bottom: 10px;">⏱️ <strong>Duration:</strong> ${data.duration} minutes</li>
          </ul>
        </div>

        ${data.paymentMethod ? `
        <div style="background-color: #e8f4ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Payment Information</h2>
          <p style="margin-bottom: 15px;">💰 <strong>Amount Due:</strong> $${data.price}</p>
          <p style="margin-bottom: 15px;">💳 <strong>Payment Method:</strong> ${data.paymentMethod}</p>
          
          ${data.paymentMethod === 'VENMO' 
            ? `<p style="margin-bottom: 15px;"><strong>Venmo:</strong> @yura-min</p>`
            : `<p style="margin-bottom: 15px;"><strong>Zelle:</strong> 714-743-7071</p>`
          }
          
          <div style="background-color: #fff; padding: 15px; border-radius: 4px; margin-top: 10px;">
            <p style="margin: 0; font-size: 14px;">⚠️ <strong>Important:</strong> Please include this reference in your payment note:</p>
            <p style="font-size: 18px; font-weight: bold; margin: 10px 0; color: #0066cc;">${data.referenceCode}</p>
          </div>
        </div>
        ` : ''}

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://calendar.google.com/calendar/event?action=TEMPLATE&dates=${format(data.startTime, "yyyyMMdd'T'HHmmss")}/${format(data.endTime, "yyyyMMdd'T'HHmmss")}&text=${encodeURIComponent(`Ice Dance Lesson - ${data.studentName}`)}&location=${encodeURIComponent(data.address)}" 
             style="display: inline-block; background-color: #0066cc; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Add to Google Calendar
          </a>
        </div>
      </div>
    `
  }),

  lessonCancelled: (data: EmailData) => ({
    subject: `Lesson Cancellation: Ice Dance Lesson - ${data.studentName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Your Lesson Has Been Cancelled</h1>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Cancelled Lesson Details</h2>
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 10px;">📅 <strong>Date:</strong> ${format(data.date, 'EEEE, MMMM d, yyyy')}</li>
            <li style="margin-bottom: 10px;">⏰ <strong>Time:</strong> ${format(data.startTime, 'h:mm a')} - ${format(data.endTime, 'h:mm a')}</li>
            <li style="margin-bottom: 10px;">📍 <strong>Location:</strong> ${data.location}</li>
          </ul>
        </div>

        <p style="margin-top: 20px; color: #666;">
          If you have any questions or would like to schedule a new lesson, please don't hesitate to contact us.
        </p>
      </div>
    `
  }),

  lessonReminder: (data: EmailData) => ({
    subject: `Reminder: Ice Dance Lesson Tomorrow - ${data.studentName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Your Lesson is Tomorrow!</h1>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Lesson Details</h2>
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 10px;">📅 <strong>Date:</strong> ${format(data.date, 'EEEE, MMMM d, yyyy')}</li>
            <li style="margin-bottom: 10px;">⏰ <strong>Time:</strong> ${format(data.startTime, 'h:mm a')} - ${format(data.endTime, 'h:mm a')}</li>
            <li style="margin-bottom: 10px;">📍 <strong>Location:</strong> ${data.location}</li>
            <li style="margin-bottom: 10px;">📝 <strong>Address:</strong> ${data.address}</li>
          </ul>
        </div>

        ${!data.paymentMethod ? `
        <div style="background-color: #ffe8e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">⚠️ Payment Reminder</h2>
          <p style="margin-bottom: 15px;">Please remember to complete your payment of <strong>$${data.price}</strong> before the lesson.</p>
        </div>
        ` : ''}

        <p style="margin-top: 20px; color: #666;">
          We look forward to seeing you tomorrow!
        </p>
      </div>
    `
  }),
};
