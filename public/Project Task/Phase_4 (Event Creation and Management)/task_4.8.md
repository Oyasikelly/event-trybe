### Task 4.8: Build Event Management Dashboard UI
**Description**: Create dashboard for event owners to manage their events.

**Implementation Steps**:
- Create `app/events/[id]/manage/page.tsx`
- Protect route: only event owner can access
- Display hero section with event banner and quick stats
- Analytics grid showing: Total Registrations, Confirmed, Capacity Used
- Registrations table:
  - Columns: User (avatar + name), Email, Status, Registered At, Actions
  - Filterable by status
  - Searchable by name/email
  - For manual approval mode: Approve/Reject buttons
- Quick action buttons: Edit Event, Share, Cancel Event
- Recent activity feed
- Chart showing registrations over time (optional: use Recharts)

**Dependencies**: Task 4.7

**Files to Create**:
- `app/events/[id]/manage/page.tsx`
- `components/events/manage/AnalyticsGrid.tsx`
- `components/events/manage/RegistrationsTable.tsx`
- `components/events/manage/EventActions.tsx`