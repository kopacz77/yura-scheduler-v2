import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';

interface EmailProps {
  firstName: string;
}

export const Email = ({ firstName }: EmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to YM Movement</Preview>
    <Body style={{
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    }}>
      <Container>
        <Heading>
          Welcome, {firstName}!
        </Heading>
        <Text>
          Thank you for joining YM Movement. We're excited to help you on your movement journey.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default Email;