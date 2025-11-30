### Task 1.5: Create Events Database Schema
**Description**: Add Events table and enums to Prisma schema.

**Implementation Steps**:
- Add enums: LocationType, ApprovalMode, EventStatus
- Create Event model with fields: id, owner_id (FK to User), title, description, banner_image_url, category, tags, location_type, location_address, location_virtual_link, start_datetime, end_datetime, timezone, approval_mode, capacity_limit, min_capacity, registration_deadline, status, showcase_enabled, showcase_description, showcase_media_urls, created_at, updated_at, published_at
- Add relation: User (one-to-many) Events
- Add indexes on owner_id, start_datetime, status, category
- Run migration: `npx prisma migrate dev --name add_events`

**Dependencies**: Task 1.4

**Files to Modify**:
- `prisma/schema.prisma`

---