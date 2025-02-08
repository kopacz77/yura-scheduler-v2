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

interface ScheduleReminderProps {
  studentName: string;
  lessonDate: string;
  lessonTime: string;
  location: string;
}

export function ScheduleReminder({
  studentName,
  lessonDate,
  lessonTime,
  location,
}: ScheduleReminderProps) {
  return (
    <Html>
      <Head />
      <Preview>Lesson Reminder for {studentName}</Preview>
      <Body style={{
        backgroundColor: '#ffffff',
        fontFamily: 'sans-serif',
      }}>
        <Container>
          <Section>
            <Heading>Lesson Reminder</Heading>
            <Text>Dear {studentName},</Text>
            <Text>
              This is a reminder about your upcoming lesson:
            </Text>
            <Text>Date: {lessonDate}</Text>
            <Text>Time: {lessonTime}</Text>
            <Text>Location: {location}</Text>
            <Text>Best regards,</Text>
            <Text>Yura Min</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
