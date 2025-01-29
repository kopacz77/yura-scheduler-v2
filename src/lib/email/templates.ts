import { formatDate, formatTime, formatCurrency } from '@/lib/utils';

export const getLessonConfirmationEmail = (data: {
  studentName: string;
  lessonDate: Date;
  lessonType: string;
  resourceName: string;
  amount: number;
  paymentMethod: string;
}) => ({
  subject: 'Lesson Booking Confirmation',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Lesson Booking Confirmation</h1>
      
      <p>Dear ${data.studentName},</p>
      
      <p>Your lesson has been successfully booked!</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Lesson Details:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Date:</strong> ${formatDate(data.lessonDate)}</li>
          <li><strong>Time:</strong> ${formatTime(data.lessonDate)}</li>
          <li><strong>Type:</strong> ${data.lessonType}</li>
          <li><strong>Location:</strong> ${data.resourceName}</li>
        </ul>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Payment Information:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Amount:</strong> ${formatCurrency(data.amount)}</li>
          <li><strong>Payment Method:</strong> ${data.paymentMethod}</li>
        </ul>
        
        <p style="margin-top: 15px;">Please complete your payment using the selected method:</p>
        ${data.paymentMethod === 'VENMO' 
          ? '<p><strong>Venmo:</strong> @yura-min</p>'
          : '<p><strong>Zelle:</strong> zelle@yuramin.com</p>'
        }
      </div>
      
      <p style="color: #666;">If you need to cancel or reschedule, please do so at least 24 hours in advance.</p>
      
      <p>Best regards,<br>Yura Min</p>
    </div>
  `
});

export const getPaymentConfirmationEmail = (data: {
  studentName: string;
  amount: number;
  lessonDate: Date;
  paymentMethod: string;
  confirmationId?: string;
}) => ({
  subject: 'Payment Confirmation',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Payment Confirmation</h1>
      
      <p>Dear ${data.studentName},</p>
      
      <p>Your payment has been received and confirmed.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Payment Details:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Amount:</strong> ${formatCurrency(data.amount)}</li>
          <li><strong>Date:</strong> ${formatDate(new Date())}</li>
          <li><strong>Lesson Date:</strong> ${formatDate(data.lessonDate)}</li>
          <li><strong>Payment Method:</strong> ${data.paymentMethod}</li>
          ${data.confirmationId ? `<li><strong>Confirmation ID:</strong> ${data.confirmationId}</li>` : ''}
        </ul>
      </div>
      
      <p>Thank you for your payment!</p>
      
      <p>Best regards,<br>Yura Min</p>
    </div>
  `
});

export const getLessonReminderEmail = (data: {
  studentName: string;
  lessonDate: Date;
  lessonType: string;
  resourceName: string;
}) => ({
  subject: 'Upcoming Lesson Reminder',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Lesson Reminder</h1>
      
      <p>Dear ${data.studentName},</p>
      
      <p>This is a reminder about your upcoming lesson:</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <ul style="list-style: none; padding: 0;">
          <li><strong>Date:</strong> ${formatDate(data.lessonDate)}</li>
          <li><strong>Time:</strong> ${formatTime(data.lessonDate)}</li>
          <li><strong>Type:</strong> ${data.lessonType}</li>
          <li><strong>Location:</strong> ${data.resourceName}</li>
        </ul>
      </div>
      
      <p>Looking forward to seeing you!</p>
      
      <p style="color: #666;">If you need to cancel or reschedule, please do so at least 24 hours in advance.</p>
      
      <p>Best regards,<br>Yura Min</p>
    </div>
  `
});

export const getPaymentReminderEmail = (data: {
  studentName: string;
  amount: number;
  lessonDate: Date;
  paymentMethod: string;
}) => ({
  subject: 'Payment Reminder',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333; text-align: center;">Payment Reminder</h1>
      
      <p>Dear ${data.studentName},</p>
      
      <p>This is a friendly reminder about your pending payment:</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <ul style="list-style: none; padding: 0;">
          <li><strong>Amount:</strong> ${formatCurrency(data.amount)}</li>
          <li><strong>Lesson Date:</strong> ${formatDate(data.lessonDate)}</li>
          <li><strong>Payment Method:</strong> ${data.paymentMethod}</li>
        </ul>
        
        <p style="margin-top: 15px;">Please complete your payment using:</p>
        ${data.paymentMethod === 'VENMO' 
          ? '<p><strong>Venmo:</strong> @yura-min</p>'
          : '<p><strong>Zelle:</strong> zelle@yuramin.com</p>'
        }
      </div>
      
      <p>If you've already made the payment, please let us know the confirmation details.</p>
      
      <p>Best regards,<br>Yura Min</p>
    </div>
  `
});
