### Task 4.4: Build Event Creation Form - Step 3 (Registration Settings)
**Description**: Create Step 3 of event creation wizard.

**Implementation Steps**:
- Step 3 fields:
  - Approval mode radio: Automated or Manual (with explanations)
  - Capacity limit (number input, optional)
  - Minimum capacity (number input, optional)
  - Registration deadline (date-time picker, optional)
- Show helpful tooltips explaining each option
- Validate capacity_limit > min_capacity
- "Back" button and "Create Event" button
- On submit:
  - Compile all form data from steps 1-3
  - Upload banner image to Cloudinary if selected
  - Call event creation API
  - Show success message
  - Redirect to event details page

**Dependencies**: Task 4.3, Task 4.1

**Files to Create**:
- `components/events/create/RegistrationSettingsStep.tsx`