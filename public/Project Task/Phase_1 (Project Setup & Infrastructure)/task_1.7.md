### Task 1.7: Create Notifications and Showcase Database Schemas
**Description**: Add Notifications and ShowcaseLinks tables.

**Implementation Steps**:
- Add NotificationType enum
- Create Notification model: id, user_id (FK), type, title, message, link, related_event_id (FK), related_registration_id (FK), is_read, read_at, created_at
- Create ShowcaseLink model: id, event_id (FK, unique), slug (unique), is_public, view_count, created_at, updated_at
- Add relations and indexes
- Run migration: `npx prisma migrate dev --name add_notifications_showcase`

**Dependencies**: Task 1.6

**Files to Modify**:
- `prisma/schema.prisma`

---