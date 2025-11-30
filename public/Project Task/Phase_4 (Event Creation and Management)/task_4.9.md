### Task 4.9: Build My Events Dashboard
**Description**: Create dashboard showing all events created by user.

**Implementation Steps**:
- Create `app/my-events/page.tsx`
- Protect route with authentication
- Add tab navigation: Upcoming, Past, Drafts, Archived
- Fetch events owned by current user, filtered by tab
- Display event cards in responsive grid
- Each card shows: banner, title, date, registrations count, capacity
- Quick actions on hover: Edit, Manage, Delete/Archive
- Empty state for each tab with "Create Event" button
- Add floating action button (FAB) for quick event creation

**Dependencies**: Task 4.5

**Files to Create**:
- `app/my-events/page.tsx`
- `components/events/MyEventsGrid.tsx`
- `components/events/EventCard.tsx`