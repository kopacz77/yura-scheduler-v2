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

interface PaymentReceiptProps {
  studentName: string;
  amount: number;
  date: string;
  lessonType: string;
}

export function PaymentReceipt({
  studentName,
  amount,
  date,
  lessonType,
}: PaymentReceiptProps) {
  return (
    <Html>
      <Head />
      <Preview>Payment Receipt for {studentName}</Preview>
      <Body style={{
        backgroundColor: '#ffffff',
        fontFamily: 'sans-serif',
      }}>
        <Container>
          <Section>
            <Heading>Payment Receipt</Heading>
            <Text>Dear {studentName},</Text>
            <Text>
              Thank you for your payment of ${amount} for your {lessonType} lesson on {date}.
            </Text>
            <Text>Best regards,</Text>
            <Text>Yura Min</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
