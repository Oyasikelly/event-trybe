### Task 4.6: Build Event Details Page
**Description**: Create page to display full event information.

**Implementation Steps**:
- Create `app/events/[id]/page.tsx`
- Fetch event details from API
- Display:
  - Banner image (full width)
  - Event title and category badge
  - Owner profile (avatar + name)
  - Date, time, location
  - Full description
  - Capacity progress bar (if capacity set)
  - Registration deadline countdown
  - Registration status (for authenticated users)
- Show different CTAs based on:
  - Not logged in: "Login to Register"
  - Not registered: "Register Now" button
  - Registered (pending): "Registration Pending"
  - Registered (confirmed): "Registered ✓" button
  - Event full: "Event Full" disabled button
  - Past event: "View Showcase" or no button
- For event owners: "Manage Event" button
- Style with Shadcn Card components

**Dependencies**: Task 4.5

**Files to Create**:
- `app/events/[id]/page.tsx`
- `components/events/EventDetailsView.tsx`
- `components/events/EventHeader.tsx`