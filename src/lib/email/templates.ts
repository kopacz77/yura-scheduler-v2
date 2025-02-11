import type { EmailTemplate, LessonEmailData, PaymentEmailData } from './types';

export function lessonConfirmation(data: LessonEmailData): EmailTemplate {
  return {
    subject: 'Lesson Confirmation',
    content: `
      <h1>Lesson Confirmation</h1>
      <p>Hi ${data.studentName},</p>
      <p>Your lesson has been scheduled successfully:</p>
      
      <div style="margin: 20px 0">
        <h2>Lesson Details</h2>
        <ul>
          <li>Date: ${data.lessonDate}</li>
          <li>Time: ${data.lessonTime}</li>
          <li>Duration: ${data.duration} minutes</li>
          <li>Type: ${data.lessonType}</li>
          ${data.price ? `<li>Price: $${data.price.toFixed(2)}</li>` : ''}
        </ul>
      </div>

      ${data.location ? `
        <div style="margin: 20px 0">
          <h2>Location</h2>
          <p>${data.location.name}</p>
          <p>${data.location.address}</p>
        </div>
      ` : ''}

      <p>Please arrive 10 minutes before your lesson.</p>
      <p>Looking forward to seeing you!</p>
    `
  };
}

export function paymentReceipt(data: PaymentEmailData): EmailTemplate {
  return {
    subject: 'Payment Receipt',
    content: `
      <h1>Payment Receipt</h1>
      <p>Hi ${data.studentName},</p>
      <p>Thank you for your payment. Here are the details:</p>
      
      <div style="margin: 20px 0">
        <h2>Payment Details</h2>
        <ul>
          <li>Amount: $${data.amount.toFixed(2)}</li>
          <li>Method: ${data.method}</li>
          <li>Reference Code: ${data.referenceCode}</li>
          <li>Date: ${data.date}</li>
        </ul>
      </div>

      <div style="margin: 20px 0">
        <h2>Lesson Details</h2>
        <ul>
          <li>Date: ${data.lesson.date}</li>
          <li>Time: ${data.lesson.time}</li>
          <li>Duration: ${data.lesson.duration} minutes</li>
          <li>Type: ${data.lesson.type}</li>
        </ul>
      </div>

      <p>If you have any questions, please don't hesitate to contact us.</p>
    `
  };
}