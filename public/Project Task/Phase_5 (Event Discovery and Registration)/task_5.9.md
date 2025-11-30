### Task 5.9: Build My Registrations Dashboard
**Description**: Create page showing events user has registered for.

**Implementation Steps**:
- Create `app/my-registrations/page.tsx`
- Protect route with authentication
- Create `app/api/v1/users/registrations/route.ts`:
  - GET: Return all registrations for current user
  - Include full event details
  - Filter by status and phase (query params)
- Display registrations in list or card format
- Show status badge: Pending, Confirmed, Rejected
- Group by: Upcoming Events, Past Events
- For each registration:
  - Event details (banner, title, date, location)
  - Registration status with icon
  - Action buttons:
    - "View Event" link
    - "Cancel Registration" (if before event)
    - "Download Calendar" (if confirmed)
- Empty state: "You haven't registered for any events yet"

**Dependencies**: Task 5.4

**Files to Create**:
- `app/my-registrations/page.tsx`
- `app/api/v1/users/registrations/route.ts`