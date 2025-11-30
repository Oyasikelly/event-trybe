### Task 6.3: Create Notification Triggers
**Description**: Implement automatic notification creation for key platform events.

**Implementation Steps**:
- Create `lib/notifications/triggers.ts` with trigger functions:
  - `notifyNewRegistration(eventId, registrationId)` - Notify event owner
  - `notifyRegistrationConfirmed(registrationId)` - Notify attendee
  - `notifyRegistrationAccepted(registrationId)` - Notify attendee
  - `notifyRegistrationRejected(registrationId, reason)` - Notify attendee
  - `notifyEventUpdated(eventId, changes)` - Notify all confirmed attendees
  - `notifyEventCancelled(eventId)` - Notify all confirmed attendees
- Integrate triggers into existing APIs:
  - Registration API: Call `notifyNewRegistration` after registration
  - Email confirmation API: Call `notifyRegistrationConfirmed`
  - Approval API: Call `notifyRegistrationAccepted` or `notifyRegistrationRejected`
  - Event update API: Call `notifyEventUpdated`
  - Event cancellation: Call `notifyEventCancelled`

**Example Implementation**:
```typescript
// lib/notifications/triggers.ts
import { createNotification } from './notification-service'
import { prisma } from '@/lib/prisma'

export async function notifyNewRegistration(
  eventId: string,
  registrationId: string
) {
  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    include: {
      user: { select: { name: true } },
      event: { select: { title: true, ownerId: true } }
    }
  })

  if (!registration) return

  await createNotification({
    userId: registration.event.ownerId,
    type: 'new_registration',
    title: 'New Registration',
    message: `${registration.user.name} registered for ${registration.event.title}`,
    link: `/events/${eventId}/manage`,
    relatedEventId: eventId,
    relatedRegistrationId: registrationId
  })
}
```

**Dependencies**: Task 6.1, Task 5.3 (Registration API)

**Files to Create**:
- `lib/notifications/triggers.ts`

**Files to Modify**:
- `app/api/v1/registrations/route.ts` (add trigger after registration)
- `app/api/v1/registrations/confirm-email/route.ts` (add trigger)
- `app/api/v1/registrations/[id]/approve/route.ts` (add trigger)
- `app/api/v1/registrations/[id]/reject/route.ts` (add trigger)
- `app/api/v1/events/[id]/route.ts` (add triggers for update/cancel)

**Testing Checklist**:
- [ ] New registration creates notification for event owner
- [ ] Email confirmation creates notification for attendee
- [ ] Approval creates notification for attendee
- [ ] Rejection creates notification with reason
- [ ] Event update notifies all confirmed attendees
- [ ] Event cancellation notifies all confirmed attendees
