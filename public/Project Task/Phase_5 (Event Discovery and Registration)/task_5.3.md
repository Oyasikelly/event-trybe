### Task 5.3: Create Event Registration API
**Description**: Build API endpoint for users to register for events.

**Implementation Steps**:
- Create `app/api/v1/registrations/route.ts` (POST handler)
- Validate authentication
- Accept eventId in request body
- Perform checks:
  - Event exists and is published
  - Event not at capacity
  - Registration deadline not passed
  - User not already registered
- Create registration with status: 'pending_email'
- Generate email_confirmation_token
- Queue confirmation email
- Create notification for event owner
- Return registration details

**Dependencies**: Task 1.7, Task 2.1

**Files to Create**:
- `app/api/v1/registrations/route.ts`