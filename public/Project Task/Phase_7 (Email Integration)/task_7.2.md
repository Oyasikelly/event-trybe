### Task 7.2: Create Authentication Email Templates
**Description**: Build email templates for authentication flows (verification, password reset).

**Implementation Steps**:
- Install React Email: `npm install @react-email/components`
- Create `lib/email/templates/email-verification.tsx`:
  - Welcome message
  - Verification button (primary CTA)
  - Fallback verification link
  - Expiration notice (24 hours)
- Create `lib/email/templates/password-reset.tsx`:
  - Password reset instructions
  - Reset button (primary CTA)
  - Fallback reset link
  - Security notice
  - Expiration notice (1 hour)
- Create `lib/email/templates/account-activated.tsx`:
  - Welcome message
  - Getting started tips
  - Link to create first event
- Create helper functions in `lib/email/auth-emails.ts`:
  - `sendVerificationEmail(email, name, token)`
  - `sendPasswordResetEmail(email, name, token)`
  - `sendAccountActivatedEmail(email, name)`

**Email Template Example**:
```tsx
// lib/email/templates/email-verification.tsx
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Link
} from '@react-email/components'

interface EmailVerificationProps {
  name: string
  verificationUrl: string
}

export default function EmailVerification({
  name,
  verificationUrl
}: EmailVerificationProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>Event Platform</Text>
          </Section>
          <Section style={content}>
            <Text style={heading}>Hi {name},</Text>
            <Text style={paragraph}>
              Welcome to Event Platform! Please verify your email address to
              complete your registration.
            </Text>
            <Button style={button} href={verificationUrl}>
              Verify Email Address
            </Button>
            <Text style={paragraph}>
              Or copy and paste this link:
              <br />
              <Link href={verificationUrl}>{verificationUrl}</Link>
            </Text>
            <Text style={note}>
              This link expires in 24 hours.
            </Text>
          </Section>
          <Section style={footer}>
            <Text style={footerText}>
              © 2025 Event Platform. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: '#f6f9fc', fontFamily: 'Inter, sans-serif' }
const container = { margin: '0 auto', padding: '20px 0', maxWidth: '600px' }
// ... more styles
```

**Dependencies**: Task 7.1

**Files to Create**:
- `lib/email/templates/email-verification.tsx`
- `lib/email/templates/password-reset.tsx`
- `lib/email/templates/account-activated.tsx`
- `lib/email/auth-emails.ts`

**Integration**:
- Modify `app/api/v1/auth/signup/route.ts` to send verification email
- Modify `app/api/v1/auth/forgot-password/route.ts` to send reset email
- Modify `app/api/v1/auth/verify-email/route.ts` to send activation email
