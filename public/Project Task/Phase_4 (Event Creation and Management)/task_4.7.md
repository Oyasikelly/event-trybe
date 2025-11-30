### Task 4.7: Build Event Management Dashboard API
**Description**: Create API for event owners to view analytics and registrations.

**Implementation Steps**:
- Create `app/api/v1/events/[id]/analytics/route.ts`:
  - Verify user is event owner
  - Return analytics: total registrations, email confirmations, pending confirmations, capacity usage percentage, registrations by day
- Create `app/api/v1/events/[id]/registrations/route.ts`:
  - GET: List all registrations for event
  - Query parameters: status filter
  - Include user details (name, email, avatar)
  - Return stats: total, pending_email, pending_approval, confirmed, rejected, cancelled
  - Only accessible to event owner

**Dependencies**: Task 4.5

**Files to Create**:
- `app/api/v1/events/[id]/analytics/route.ts`
- `app/api/v1/events/[id]/registrations/route.ts`