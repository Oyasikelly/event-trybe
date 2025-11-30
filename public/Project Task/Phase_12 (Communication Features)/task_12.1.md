### Task 12.1: Event Owner Announcements System
**Description**: Build functionality for event owners to send announcements to confirmed attendees.

**Implementation Steps**:
- Create `app/api/v1/events/[id]/announcements/route.ts`:
  - POST: Send announcement to attendees
  - Verify user is event owner
  - Accept: subject, message, recipientFilter
  - Recipient filters: all_confirmed, pending_approval, specific_users
  - Queue emails to all recipients
  - Create notification for each recipient
  - Store announcement in database (optional)
- Create `components/events/manage/AnnouncementModal.tsx`:
  - Modal dialog for composing announcement
  - Subject input
  - Message textarea (rich text optional)
  - Recipient selector (dropdown)
  - Preview option
  - Send button with confirmation
- Create `lib/email/templates/event-announcement.tsx`:
  - Email template for announcements
  - Event details header
  - Announcement content
  - Event owner signature
  - Link to event page
- Add announcement button to event management dashboard
- Create announcement history view (optional)

**API Endpoint**:
```typescript
// app/api/v1/events/[id]/announcements/route.ts
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  const { subject, message, recipientFilter } = await request.json()

  // Verify ownership
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      registrations: {
        where: getRecipientFilter(recipientFilter),
        include: { user: true }
      }
    }
  })

  if (event.ownerId !== session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  // Send emails to all recipients
  for (const registration of event.registrations) {
    await sendAnnouncementEmail({
      to: registration.user.email,
      subject,
      message,
      event,
      user: registration.user
    })

    // Create notification
    await createNotification({
      userId: registration.user.id,
      type: 'event_updated',
      title: `Announcement: ${event.title}`,
      message: subject,
      link: `/events/${event.id}`
    })
  }

  return NextResponse.json({ 
    success: true, 
    recipientCount: event.registrations.length 
  })
}
```

**Dependencies**: Task 7.1 (Email Service), Task 6.1 (Notifications)

**Files to Create**:
- `app/api/v1/events/[id]/announcements/route.ts`
- `components/events/manage/AnnouncementModal.tsx`
- `lib/email/templates/event-announcement.tsx`
- `lib/email/announcement-emails.ts`

**Files to Modify**:
- `app/events/[id]/manage/page.tsx` (add announcement button)

**Testing**:
- [ ] Send announcement to all confirmed attendees
- [ ] Filter recipients correctly
- [ ] Emails delivered successfully
- [ ] Notifications created
- [ ] Only event owner can send
- [ ] Preview works correctly
