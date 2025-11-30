### Task 7.1: Setup Email Service with Resend
**Description**: Configure Resend email service and create email infrastructure.

**Implementation Steps**:
- Install Resend SDK: `npm install resend`
- Create `.env` variables:
  - `RESEND_API_KEY=re_xxxxx`
  - `RESEND_FROM_EMAIL=noreply@yourdomain.com`
  - `NEXT_PUBLIC_APP_URL=https://yourdomain.com`
- Create `lib/email/resend-client.ts`:
  - Initialize Resend client
  - Export configured instance
- Create `lib/email/email-service.ts`:
  - `sendEmail(to, subject, html)` - Base send function
  - Error handling and logging
  - Rate limiting checks
- Create `lib/email/templates/base-template.tsx`:
  - React Email base layout
  - Header with logo
  - Footer with unsubscribe link
  - Responsive styling

**Technical Setup**:
```typescript
// lib/email/resend-client.ts
import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

// lib/email/email-service.ts
import { resend } from './resend-client'

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to,
      subject,
      html
    })

    if (error) {
      console.error('Email send error:', error)
      throw new Error(error.message)
    }

    console.log('Email sent successfully:', data?.id)
    return data
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}
```

**Dependencies**: None (foundational)

**Files to Create**:
- `lib/email/resend-client.ts`
- `lib/email/email-service.ts`
- `lib/email/templates/base-template.tsx`

**Environment Variables**:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Testing**:
- [ ] Send test email
- [ ] Verify email delivery
- [ ] Check error handling for invalid emails
- [ ] Verify rate limiting
