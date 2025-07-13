import { Body, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text } from '@react-email/components'
import {
  btnContainer,
  codeText,
  container,
  h1,
  logo,
  main,
  paragraph,
  validityText,
  verificationSection,
  verifyText,
} from './css'

export interface ConfirmEmailProps {
  code?: string
}

export function ConfirmEmail({ code }: ConfirmEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>The AI platform that helps you uncover qualified leads.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={'https://zpgqhogoevbgpxustvmo.supabase.co/storage/v1/object/public/produc_imgs//emailLodgo.png'}
            width="140"
            height="70"
            alt="acme"
            style={{ objectFit: 'contain', ...logo }}
          />

          <Section style={btnContainer}>
            <Heading style={h1}>Verify your email address</Heading>
            <Text style={paragraph}>
              Thanks for starting the new ACME account creation process. We want to make sure it's really you. Please
              enter the following verification code when prompted. If you don&apos;t want to create an account, you can
              ignore this message.
            </Text>
            <Section style={{ placeContent: 'center', ...verificationSection }}>
              <Text style={verifyText}>Verification code</Text>

              <Text style={codeText}>{code}</Text>
              <Text style={validityText}>(This code is valid for 10 minutes)</Text>
            </Section>
          </Section>
          <Hr />

          <Text style={paragraph}>
            Best,
            <br />
            The ACME team
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default ConfirmEmail
