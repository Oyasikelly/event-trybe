### Task 8.2: Add Google Calendar Quick Add Button
**Description**: Implement "Add to Google Calendar" button for easy calendar integration.

**Implementation Steps**:
- Create `lib/calendar/google-calendar-url.ts`:
  - `generateGoogleCalendarUrl(event)` - Generate Google Calendar URL
  - URL encode event details
  - Format dates in Google Calendar format
  - Include location and description
- Create `components/calendar/AddToCalendarButton.tsx`:
  - Dropdown button with calendar options
  - Google Calendar option
  - Download ICS option
  - Outlook option (web)
  - Apple Calendar option (ICS download)
- Add button to:
  - Event details page (for registered users)
  - Registration acceptance email
  - My Registrations dashboard
- Create `components/calendar/CalendarIcon.tsx`:
  - Calendar icon with dropdown
  - Styled with Shadcn components

**Google Calendar URL Format**:
```typescript
// lib/calendar/google-calendar-url.ts
export function generateGoogleCalendarUrl(event: Event) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    location: event.locationType === 'physical' 
      ? event.locationAddress! 
      : event.locationVirtualLink!,
    dates: formatGoogleCalendarDates(event.startDatetime, event.endDatetime)
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function formatGoogleCalendarDates(start: Date, end: Date) {
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }
  return `${formatDate(start)}/${formatDate(end)}`
}
```

**UI Component**:
```tsx
// components/calendar/AddToCalendarButton.tsx
import { Calendar, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export function AddToCalendarButton({ event, registrationId }: Props) {
  const googleCalendarUrl = generateGoogleCalendarUrl(event)
  const icsDownloadUrl = `/api/v1/calendar/event/${registrationId}/ics`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Add to Calendar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <a href={googleCalendarUrl} target="_blank" rel="noopener">
            Google Calendar
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={icsDownloadUrl} download>
            <Download className="mr-2 h-4 w-4" />
            Download ICS
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

**Dependencies**: Task 8.1

**Files to Create**:
- `lib/calendar/google-calendar-url.ts`
- `components/calendar/AddToCalendarButton.tsx`
- `components/calendar/CalendarIcon.tsx`

**Files to Modify**:
- `app/events/[id]/page.tsx` (add button for registered users)
- `app/my-registrations/page.tsx` (add button to each registration)
- `lib/email/templates/registration-accepted.tsx` (add button to email)

**Testing**:
- [ ] Click "Add to Google Calendar" opens correct Google Calendar page
- [ ] Event details are correctly populated
- [ ] Timezone is handled correctly
- [ ] ICS download works
- [ ] Button appears only for confirmed registrations
