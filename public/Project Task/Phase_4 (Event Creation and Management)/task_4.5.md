### Task 4.5: Create Event Details API
**Description**: Build APIs to fetch, update, and delete events.

**Implementation Steps**:
- Add to `app/api/v1/events/route.ts` (GET handler):
  - Query parameters: status, phase, category, search, page, limit
  - Filter events based on query params
  - Calculate phase (upcoming, ongoing, past) dynamically
  - Return paginated results with event count
  - Include owner name and registration count
- Create `app/api/v1/events/[id]/route.ts`:
  - GET: Fetch single event by ID with full details
  - Include owner information and registration stats
  - If authenticated, include user's registration status
  - PUT: Update event (only owner authorized)
  - DELETE: Soft delete or cancel event (only owner authorized)

**Dependencies**: Task 4.1

**Files to Create**:
- `app/api/v1/events/[id]/route.ts`
- `lib/utils/event-phase.ts` (calculate event phase helper)
