import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
} from '@react-email/components';
import React from 'react';

interface EmailVerificationProps {
  userName: string;
  verificationLink: string;
}

const EmailVerification = ({userName, verificationLink}:EmailVerificationProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email to get started</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Verify your email</Heading>
          <Text style={text}>Hi {userName},</Text>
          <Text style={text}>
            Thanks for signing up! Please verify your email by clicking the button below.
          </Text>
          <Section style={{ textAlign: 'center' }}>
            <Button href={verificationLink} style={button}>
              Verify Email
            </Button>
          </Section>
           <Text style={text}>
            This Link is valid for 10 minutes.
          </Text>
          <Text style={text}>
            If you didn't sign up, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailVerification;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Helvetica, Arial, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '40px auto',
  padding: '20px',
  borderRadius: '8px',
  maxWidth: '480px',
};

const heading = {
  fontSize: '24px',
  marginBottom: '20px',
  color: '#333',
};

const text = {
  fontSize: '16px',
  color: '#444',
  marginBottom: '16px',
};

const button = {
  backgroundColor: '#007bff',
  color: '#fff',
  fontSize: '16px',
  padding: '12px 24px',
  borderRadius: '5px',
  textDecoration: 'none',
};

