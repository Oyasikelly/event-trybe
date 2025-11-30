### Task 7.3: Create Registration Email Templates
**Description**: Build email templates for event registration workflows.

**Implementation Steps**:
- Create `lib/email/templates/registration-confirmation.tsx`:
  - Registration confirmation message
  - Event details summary (title, date, location)
  - Email confirmation button
  - Event banner image
  - Next steps based on approval mode
- Create `lib/email/templates/registration-accepted.tsx`:
  - Acceptance confirmation
  - Event details with countdown
  - Add to calendar button
  - Event location/virtual link
  - Contact event owner option
- Create `lib/email/templates/registration-rejected.tsx`:
  - Polite rejection message
  - Reason for rejection (if provided)
  - Browse other events CTA
  - Encourage future participation
- Create `lib/email/templates/owner-new-registration.tsx`:
  - New registration notification for owner
  - Attendee information (name, email)
  - Registration status
  - Link to manage registrations
  - Quick approve/reject buttons (for manual mode)
- Create helper functions in `lib/email/registration-emails.ts`:
  - `sendRegistrationConfirmation(registration)`
  - `sendRegistrationAccepted(registration)`
  - `sendRegistrationRejected(registration, reason)`
  - `sendOwnerNewRegistration(registration)`

**Email Content Guidelines**:
- Use event banner as header image (16:9 aspect ratio)
- Include event phase badge (Upcoming/Ongoing)
- Show capacity indicator if near full
- Personalize with recipient name
- Include timezone-aware date/time
- Add calendar invite attachment for accepted registrations

**Dependencies**: Task 7.1, Task 5.3 (Registration API)

**Files to Create**:
- `lib/email/templates/registration-confirmation.tsx`
- `lib/email/templates/registration-accepted.tsx`
- `lib/email/templates/registration-rejected.tsx`
- `lib/email/templates/owner-new-registration.tsx`
- `lib/email/registration-emails.ts`

**Integration Points**:
- Call `sendRegistrationConfirmation` after registration creation
- Call `sendRegistrationAccepted` after approval (automated or manual)
- Call `sendRegistrationRejected` after rejection
- Call `sendOwnerNewRegistration` for new registrations
