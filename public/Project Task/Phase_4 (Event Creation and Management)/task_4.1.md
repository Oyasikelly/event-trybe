### Task 4.1: Create Event Creation API
**Description**: Build API endpoint for creating new events.

**Implementation Steps**:
- Create `app/api/v1/events/route.ts` (POST handler)
- Validate authentication
- Validate input with Zod schema:
  - Required: title, description, location_type, start_datetime, end_datetime, timezone, approval_mode
  - Optional: banner_image_url, category, tags, location_address, location_virtual_link, capacity_limit, min_capacity, registration_deadline
  - Validate: end_datetime > start_datetime, capacity_limit > 0
- Create event in database with owner_id = current user
- Set default status: 'draft' if not specified
- Return created event with full details

**Dependencies**: Task 1.7, Task 2.1

**Files to Create**:
- `app/api/v1/events/route.ts`
- `lib/validation/event.validation.ts`