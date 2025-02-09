import { type Student, type User } from '@prisma/client';
import type { Appointment } from '@/models/types';
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

interface LessonConfirmationProps {
  appointment: Appointment;
  student: Student & { user: User };
  coachName: string;
}

export function LessonConfirmation({ 
  appointment, 
  student,
  coachName
}: LessonConfirmationProps) {
  const previewText = `Your lesson with ${coachName} is confirmed for ${format(appointment.start, 'MMM d, yyyy')}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Lesson Confirmation</Heading>
          
          <Section style={section}>
            <Text style={text}>
              Hello {student.user.name},
            </Text>
            <Text style={text}>
              Your lesson with {coachName} has been confirmed for:
            </Text>
            <Text style={text}>
              <strong>Date:</strong> {format(appointment.start, 'MMMM d, yyyy')}
              <br />
              <strong>Time:</strong> {format(appointment.start, 'h:mm a')} - {format(appointment.end, 'h:mm a')}
              <br />
              <strong>Type:</strong> {appointment.details.lessonType}
            </Text>
          </Section>

          <Section style={section}>
            <Text style={text}>
              {appointment.details.notes && (
                <>
                  <strong>Notes:</strong> {appointment.details.notes}
                  <br />
                </>
              )}
              {appointment.details.focus && (
                <>
                  <strong>Focus:</strong> {appointment.details.focus}
                </>
              )}
            </Text>
          </Section>

          <Section style={section}>
            <Text style={text}>
              Please arrive at least 10 minutes before your lesson time. Don't forget your skates and water bottle!
            </Text>
            <Text style={text}>
              Need to make changes? Please contact us at least 24 hours before your lesson time.
            </Text>
          </Section>

          <Text style={footer}>
            See you on the ice!
            <br />
            - Coach {coachName}
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