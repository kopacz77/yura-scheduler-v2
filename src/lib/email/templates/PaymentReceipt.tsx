import { LessonType, PaymentMethod } from '@prisma/client';
import * as React from 'react';
import { format } from 'date-fns';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface EmailStudent {
  user: {
    name: string | null;
  };
}

interface EmailPayment {
  amount: number;
  method: PaymentMethod;
  createdAt: Date;
}

interface EmailLesson {
  startTime: Date;
  endTime: Date;
  type: LessonType;
}

interface PaymentReceiptProps {
  student: EmailStudent;
  payment: EmailPayment;
  lesson: EmailLesson;
}

export function PaymentReceipt({ 
  student,
  payment,
  lesson
}: PaymentReceiptProps) {
  const previewText = `Payment receipt for your lesson on ${format(lesson.startTime, 'MMM d, yyyy')}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Payment Receipt</Heading>
          
          <Section style={section}>
            <Text style={text}>
              Hello {student.user.name || 'Student'},
            </Text>
            <Text style={text}>
              Thank you for your payment. Here's your receipt:
            </Text>

            <div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <Text style={text}>
                <strong>Amount:</strong> ${payment.amount.toFixed(2)}
                <br />
                <strong>Date:</strong> {format(payment.createdAt, 'MMMM d, yyyy')}
                <br />
                <strong>Method:</strong> {payment.method}
              </Text>
            </div>

            <div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <Text style={text}>
                <strong>Lesson Date:</strong> {format(lesson.startTime, 'MMMM d, yyyy')}
                <br />
                <strong>Time:</strong> {format(lesson.startTime, 'h:mm a')} - {format(lesson.endTime, 'h:mm a')}
                <br />
                <strong>Type:</strong> {lesson.type}
              </Text>
            </div>
          </Section>

          <Text style={footer}>
            Thank you for choosing YM Movement!
            <br />
            [Business Details & Tax Info]
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const section = {
  padding: '0 48px',
};

const h1 = {
  color: '#333',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const footer = {
  color: '#666',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '48px 0 0',
  textAlign: 'center' as const,
  fontStyle: 'italic' as const,
};