import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Underdog"
          fallbackFontFamily={["Arial", "Verdana", "sans-serif"]}
          webFont={{
            url: 'https://fonts.gstatic.com/s/underdog/v19/CHygV-jCElj7diMroW4.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>🚀 Your verification code is: {otp}</Preview>
      <Section>
        <Row>
          <Heading as="h2" style={{ fontFamily: 'Underdog, Arial, Verdana, sans-serif' }}>
            👋 Hello {username},
          </Heading>
        </Row>
        <Row>
          <Text style={{ fontFamily: 'Underdog, Arial, Verdana, sans-serif' }}>
            🎉 Thank you for registering! Please use the following verification code to complete your registration:
          </Text>
        </Row>
        <Row>
          <Text style={{ fontFamily: 'Underdog, Arial, Verdana, sans-serif', fontSize: '24px' }}>
            🔐 <strong>{otp}</strong>
          </Text>
        </Row>
        <Row>
          <Text style={{ fontFamily: 'Underdog, Arial, Verdana, sans-serif' }}>
            ❌ If you did not request this code, please ignore this email.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}