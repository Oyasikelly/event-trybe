### Task 7.4: Create Event Reminder Email System
**Description**: Implement automated reminder emails for upcoming events.

**Implementation Steps**:
- Install Upstash QStash: `npm install @upstash/qstash`
- Configure QStash environment variables:
  - `QSTASH_URL`
  - `QSTASH_TOKEN`
  - `QSTASH_CURRENT_SIGNING_KEY`
  - `QSTASH_NEXT_SIGNING_KEY`
- Create `lib/email/templates/event-reminder-24h.tsx`:
  - "Event tomorrow" message
  - Event details summary
  - Preparation checklist
  - Add to calendar button
  - Location/virtual link
- Create `lib/email/templates/event-reminder-1h.tsx`:
  - "Event starting soon" message
  - Quick event details
  - Direct join/location link
  - Last-minute instructions
- Create `lib/jobs/schedule-reminders.ts`:
  - Function to schedule 24h reminder
  - Function to schedule 1h reminder
  - QStash job scheduling
- Create `app/api/jobs/send-reminder/route.ts`:
  - Webhook endpoint for QStash
  - Verify QStash signature
  - Fetch event and confirmed registrations
  - Send reminder emails
  - Update reminder_sent flags
- Create `lib/email/reminder-emails.ts`:
  - `send24HourReminder(registration)`
  - `send1HourReminder(registration)`

**Scheduling Logic**:
```typescript
// lib/jobs/schedule-reminders.ts
import { Client } from '@upstash/qstash'

const qstash = new Client({
  token: process.env.QSTASH_TOKEN!
})

export async function schedule24HourReminder(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  })

  if (!event) return

  const reminderTime = new Date(event.startDatetime)
  reminderTime.setHours(reminderTime.getHours() - 24)

  await qstash.publishJSON({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/send-reminder`,
    body: { eventId, type: '24h' },
    notBefore: Math.floor(reminderTime.getTime() / 1000)
  })
}
```

**Dependencies**: Task 7.1, Task 5.3

**Files to Create**:
- `lib/email/templates/event-reminder-24h.tsx`
- `lib/email/templates/event-reminder-1h.tsx`
- `lib/jobs/schedule-reminders.ts`
- `app/api/jobs/send-reminder/route.ts`
- `lib/email/reminder-emails.ts`

**Integration**:
- Schedule reminders when event is published
- Schedule reminders when registration is confirmed
- Update `reminder_sent_24h` and `reminder_sent_1h` flags after sending

**Testing**:
- [ ] Schedule reminder for test event
- [ ] Verify QStash webhook receives request
- [ ] Confirm emails sent to all confirmed attendees
- [ ] Check reminder flags updated in database
