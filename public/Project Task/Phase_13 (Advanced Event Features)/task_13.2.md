### Task 13.2: Event Duplication Feature
**Description**: Allow event owners to duplicate existing events as templates.

**Implementation Steps**:
- Create `app/api/v1/events/[id]/duplicate/route.ts`:
  - POST: Duplicate event
  - Verify user is event owner
  - Copy all event fields except:
    - id (generate new)
    - status (set to 'draft')
    - created_at, updated_at (new timestamps)
    - published_at (null)
    - registrations (don't copy)
    - showcase data (don't copy)
  - Optionally copy banner image
  - Return new event ID
- Add "Duplicate Event" button to:
  - Event management dashboard
  - My Events page (dropdown menu on event card)
  - Event details page (owner only)
- Create confirmation dialog:
  - Explain what will be copied
  - Option to modify title (append "Copy")
  - Confirm button
- Redirect to edit page after duplication

**API Implementation**:
```typescript
// app/api/v1/events/[id]/duplicate/route.ts
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  
  const originalEvent = await prisma.event.findUnique({
    where: { id: params.id }
  })

  if (originalEvent.ownerId !== session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const newEvent = await prisma.event.create({
    data: {
      ownerId: session.user.id,
      title: `${originalEvent.title} (Copy)`,
      description: originalEvent.description,
      bannerImageUrl: originalEvent.bannerImageUrl,
      category: originalEvent.category,
      tags: originalEvent.tags,
      locationType: originalEvent.locationType,
      locationAddress: originalEvent.locationAddress,
      locationVirtualLink: originalEvent.locationVirtualLink,
      // Don't copy dates - user must set new dates
      startDatetime: new Date(),
      endDatetime: new Date(),
      timezone: originalEvent.timezone,
      approvalMode: originalEvent.approvalMode,
      capacityLimit: originalEvent.capacityLimit,
      minCapacity: originalEvent.minCapacity,
      status: 'draft'
    }
  })

  return NextResponse.json({ 
    success: true, 
    eventId: newEvent.id 
  })
}
```

**UI Component**:
```tsx
// components/events/DuplicateEventButton.tsx
export function DuplicateEventButton({ eventId }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleDuplicate = async () => {
    const response = await fetch(`/api/v1/events/${eventId}/duplicate`, {
      method: 'POST'
    })
    const data = await response.json()
    
    if (data.success) {
      router.push(`/events/${data.eventId}/edit`)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Copy className="mr-2 h-4 w-4" />
        Duplicate Event
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Event</DialogTitle>
            <DialogDescription>
              This will create a copy of this event as a draft. 
              You'll need to set new dates and publish it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDuplicate}>
              Duplicate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
```

**Dependencies**: Task 4.1 (Event Creation API), Task 4.10 (Event Edit)

**Files to Create**:
- `app/api/v1/events/[id]/duplicate/route.ts`
- `components/events/DuplicateEventButton.tsx`

**Files to Modify**:
- `app/events/[id]/manage/page.tsx` (add duplicate button)
- `app/my-events/page.tsx` (add to event card menu)
- `components/events/EventCard.tsx` (add duplicate option)

**Testing**:
- [ ] Duplicate event creates new draft
- [ ] All fields copied correctly
- [ ] Registrations not copied
- [ ] Only owner can duplicate
- [ ] Redirects to edit page
- [ ] Title has "(Copy)" appended
