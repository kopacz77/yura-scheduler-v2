import { type Payment, type Student, type Lesson, type User } from '@prisma/client';
import * as React from 'react';
import { format } from 'date-fns';

interface PaymentReceiptProps {
  payment: Payment;
  student: Student & { user: User };
  lesson: Lesson;
}

export const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  payment,
  student,
  lesson,
}) => (
  <div>
    <h1>Payment Receipt</h1>
    <p>Hello {student.user.name},</p>
    <p>Thank you for your payment. Here's your receipt:</p>

    <div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
      <h2 style={{ marginTop: 0 }}>Payment Details</h2>
      <p><strong>Amount:</strong> ${payment.amount.toFixed(2)}</p>
      <p><strong>Date:</strong> {format(payment.createdAt, 'MMMM d, yyyy')}</p>
      <p><strong>Method:</strong> {payment.method}</p>
      <p><strong>Status:</strong> {payment.status}</p>
      <p><strong>Reference Code:</strong> {payment.referenceCode}</p>
    </div>

    <div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
      <h2 style={{ marginTop: 0 }}>Lesson Details</h2>
      <p><strong>Date:</strong> {format(lesson.startTime, 'MMMM d, yyyy')}</p>
      <p><strong>Time:</strong> {format(lesson.startTime, 'h:mm a')} - {format(lesson.endTime, 'h:mm a')}</p>
      <p><strong>Type:</strong> {lesson.type}</p>
      <p><strong>Duration:</strong> {lesson.duration} minutes</p>
    </div>

    <p style={{ marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
      Please keep this receipt for your records. If you have any questions about this payment,
      please don't hesitate to contact us.
    </p>

    <div style={{ marginTop: '20px', padding: '20px', borderTop: '1px solid #e5e7eb' }}>
      <p style={{ fontSize: '14px', color: '#6b7280' }}>
        Yura Min Ice Dance<br />
        [Business Address]<br />
        [Contact Information]<br />
        [Tax ID if applicable]
      </p>
    </div>
  </div>
);