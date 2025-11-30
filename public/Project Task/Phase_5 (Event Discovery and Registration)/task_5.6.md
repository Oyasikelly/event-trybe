### Task 5.6: Build Registration Confirmation Page
**Description**: Create page to handle email confirmation link.

**Implementation Steps**:
- Create `app/registrations/confirm/page.tsx`
- Extract token from URL query parameters
- Call confirm-email API on mount
- Show loading spinner during confirmation
- Display success message based on approval mode:
  - Automated: "Registration confirmed! You'll receive an email with event details."
  - Manual: "Email confirmed! Waiting for event owner approval."
- Show link to "View Event" and "My Registrations"
- Handle error states: invalid token, already confirmed

**Dependencies**: Task 5.4

**Files to Create**:
- `app/registrations/confirm/page.tsx`