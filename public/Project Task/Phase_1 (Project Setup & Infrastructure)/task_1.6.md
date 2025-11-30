### Task 1.6: Create Registrations Database Schema
**Description**: Add Registrations table for event registrations.

**Implementation Steps**:
- Add enums: RegistrationStatus, ApprovalStatus
- Create Registration model with fields: id, event_id (FK), user_id (FK), registration_status, email_confirmed_at, email_confirmation_token, approval_status, approved_at, approved_by_id (FK to User), rejection_reason, cancelled_at, calendar_invite_sent, reminder_sent_24h, reminder_sent_1h, registered_at, updated_at
- Add unique constraint on (event_id, user_id)
- Add relations: Event (one-to-many) Registrations, User (one-to-many) Registrations
- Add indexes on event_id, user_id, registration_status
- Run migration: `npx prisma migrate dev --name add_registrations`

**Dependencies**: Task 1.5

**Files to Modify**:
- `prisma/schema.prisma`

---
