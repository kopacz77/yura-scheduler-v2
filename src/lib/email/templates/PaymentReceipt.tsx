import * as React from 'react';

interface PaymentReceiptProps {
  payment: {
    amount: number;
    method: string;
    referenceCode: string;
    createdAt: Date;
  };
  student: {
    user: {
      name: string;
      email: string;
    };
  };
  lesson: {
    startTime: Date;
    duration: number;
    type: string;
  };
}

export function PaymentReceipt({ payment, student, lesson }: PaymentReceiptProps) {
  return (
    <div>
      <h1>Payment Receipt</h1>
      <p>Hi {student.user.name},</p>
      <p>Thank you for your payment. Here are the details:</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Payment Details</h2>
        <ul>
          <li>Amount: ${payment.amount.toFixed(2)}</li>
          <li>Method: {payment.method}</li>
          <li>Reference Code: {payment.referenceCode}</li>
          <li>Date: {payment.createdAt.toLocaleDateString()}</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Lesson Details</h2>
        <ul>
          <li>Date: {lesson.startTime.toLocaleDateString()}</li>
          <li>Time: {lesson.startTime.toLocaleTimeString()}</li>
          <li>Duration: {lesson.duration} minutes</li>
          <li>Type: {lesson.type}</li>
        </ul>
      </div>

      <p style={{ marginTop: '20px' }}>
        If you have any questions, please don't hesitate to contact us.
      </p>
    </div>
  );
}
