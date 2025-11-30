### Task 4.10: Build Event Edit Page
**Description**: Create page for owners to edit existing events.

**Implementation Steps**:
- Create `app/events/[id]/edit/page.tsx`
- Protect route: only event owner can access
- Pre-populate form with existing event data
- Use same multi-step wizard as creation (reuse components)
- Add ability to change banner image
- Validation: prevent changing past events
- On submit:
  - Call PUT endpoint to update event
  - If event has registrations, show warning about changes
  - Send notification to registered users about updates
- Redirect to event details page on success

**Dependencies**: Task 4.2, Task 4.3, Task 4.4, Task 4.5

**Files to Create**:
- `app/events/[id]/edit/page.tsx`
