### Task 8.1: Implement ICS Calendar File Generation
**Description**: Create functionality to generate ICS calendar files for event registrations.

**Implementation Steps**:
- Install ICS library: `npm install ical-generator`
- Create `lib/calendar/ics-generator.ts`:
  - `generateICS(event, user)` - Generate ICS file content
  - Include event details: title, description, location, start/end times
  - Add organizer information (event owner)
  - Add attendee information (registered user)
  - Set timezone correctly
  - Add reminder alarms (24h and 1h before)
- Create `app/api/v1/calendar/event/[registrationId]/ics/route.ts`:
  - GET endpoint to download ICS file
  - Verify user is registered for the event
  - Generate ICS file
  - Return with proper headers for download
- Create utility function to attach ICS to emails:
  - Modify email service to support attachments
  - Attach ICS file to acceptance emails

**ICS Generation Example**:
```typescript
// lib/calendar/ics-generator.ts
import ical from 'ical-generator'

export function generateICS(event: Event, user: User) {
  const calendar = ical({ name: 'Event Calendar' })

  calendar.createEvent({
    start: event.startDatetime,
    end: event.endDatetime,
    summary: event.title,
    description: event.description,
    location: event.locationType === 'physical' 
      ? event.locationAddress 
      : event.locationVirtualLink,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${event.id}`,
    organizer: {
      name: event.owner.name,
      email: event.owner.email
    },
    attendees: [{
      name: user.name,
      email: user.email,
      rsvp: true,
      status: 'ACCEPTED'
    }],
    alarms: [
      {
        type: 'display',
        trigger: 86400, // 24 hours before
        description: 'Event reminder: ' + event.title
      },
      {
        type: 'display',
        trigger: 3600, // 1 hour before
        description: 'Event starting soon: ' + event.title
      }
    ]
  })

  return calendar.toString()
}
```

**Dependencies**: Task 5.3 (Registration API)

**Files to Create**:
- `lib/calendar/ics-generator.ts`
- `app/api/v1/calendar/event/[registrationId]/ics/route.ts`

**Files to Modify**:
- `lib/email/email-service.ts` (add attachment support)
- `lib/email/registration-emails.ts` (attach ICS to acceptance emails)

**Testing**:
- [ ] Generate ICS file for test event
- [ ] Verify ICS file imports correctly in Google Calendar
- [ ] Verify ICS file imports correctly in Outlook
- [ ] Test timezone handling
- [ ] Verify reminders are set correctly
