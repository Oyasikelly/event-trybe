### Task 5.5: Implement Registration Flow in Event Details Page
**Description**: Add registration functionality to event details page.

**Implementation Steps**:
- Modify `app/events/[id]/page.tsx`
- Add "Register Now" button (if user eligible)
- On click:
  - Call registration API
  - Show success modal: "Check your email to confirm registration"
  - Update button state to "Pending Email Confirmation"
- Handle error states:
  - Event full: Show "Event Full" message
  - Already registered: Show current status
  - Not authenticated: Redirect to login with return URL
- Real-time update button state after registration

**Dependencies**: Task 5.3, Task 4.6

**Files to Modify**:
- `app/events/[id]/page.tsx`
- `components/events/RegistrationButton.tsx` (new component)
