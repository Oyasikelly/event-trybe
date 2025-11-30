### Task 5.4: Create Registration Email Confirmation API
**Description**: Build endpoint to confirm registration email.

**Implementation Steps**:
- Create `app/api/v1/registrations/confirm-email/route.ts`
- Accept token in request body
- Find registration by email_confirmation_token
- Validate token not expired
- Update registration:
  - emailConfirmedAt: now
  - email_confirmation_token: null
  - For automated mode: registrationStatus: 'confirmed'
  - For manual mode: registrationStatus: 'pending_approval'
- If automated mode:
  - Queue acceptance email with calendar invite
  - Create notification for user
- If manual mode:
  - Create notification for event owner (new registration pending)
- Return success with autoApproved flag

**Dependencies**: Task 5.3

**Files to Create**:
- `app/api/v1/registrations/confirm-email/route.ts`