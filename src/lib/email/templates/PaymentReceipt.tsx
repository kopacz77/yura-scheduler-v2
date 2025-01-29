import { type Payment, type Student, type Appointment } from '@prisma/client';
import * as React from 'react';
import { format } from 'date-fns';

interface PaymentReceiptProps {
  payment: Payment;
  student: Student;
  appointment: Appointment;
}

export const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  payment,
  student,
  appointment,
}) => (
  <div>
    <h1>Payment Receipt</h1>
    <p>Hello {student.name},</p>
    <p>Thank you for your payment. Here's your receipt:</p>

    <div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
      <h2 style={{ marginTop: 0 }}>Payment Details</h2>
      <p><strong>Amount:</strong> ${payment.amount.toFixed(2)}</p>
      <p><strong>Date:</strong> {format(payment.paidAt || new Date(), 'MMMM d, yyyy')}</p>
      <p><strong>Method:</strong> {payment.method}</p>
      <p><strong>Status:</strong> {payment.status}</p>
      {payment.confirmationId && (
        <p><strong>Confirmation ID:</strong> {payment.confirmationId}</p>
      )}
    </div>

    <div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
      <h2 style={{ marginTop: 0 }}>Lesson Details</h2>
      <p><strong>Date:</strong> {format(appointment.start, 'MMMM d, yyyy')}</p>
      <p><strong>Time:</strong> {format(appointment.start, 'h:mm a')} - {format(appointment.end, 'h:mm a')}</p>
      <p><strong>Type:</strong> {appointment.lessonType}</p>
    </div>

    <p style={{ marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
      Please keep this receipt for your records. If you have any questions about this payment,
      please don't hesitate to contact us.
    </p>

    <div style={{ marginTop: '20px', padding: '20px', borderTop: '1px solid #e5e7eb' }}>
      <p style={{ fontSize: '14px', color: '#6b7280' }}>
        Tax ID: XX-XXXXXXX<br />
        Yura Min Ice Dance<br />
        [Address]<br />
        [Contact Information]
      </p>
    </div>
  </div>
);