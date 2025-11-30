### Task 5.7: Build Manual Approval APIs
**Description**: Create endpoints for event owners to approve/reject registrations.

**Implementation Steps**:
- Create `app/api/v1/registrations/[id]/approve/route.ts`:
  - POST handler
  - Verify user is event owner
  - Update registration:
    - registrationStatus: 'confirmed'
    - approvalStatus: 'accepted'
    - approvedAt: now
    - approvedById: current user
  - Queue acceptance email with calendar invite
  - Create notification for attendee
- Create `app/api/v1/registrations/[id]/reject/route.ts`:
  - POST handler
  - Accept optional reason in body
  - Verify user is event owner
  - Update registration:
    - registrationStatus: 'rejected'
    - approvalStatus: 'rejected'
    - rejectionReason: reason
  - Queue rejection email
  - Create notification for attendee

**Dependencies**: Task 5.4

**Files to Create**:
- `app/api/v1/registrations/[id]/approve/route.ts`
- `app/api/v1/registrations/[id]/reject/route.ts`
