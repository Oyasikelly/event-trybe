### Task 4.2: Build Event Creation Form - Step 1 (Basic Details)
**Description**: Create multi-step event creation wizard - Step 1.

**Implementation Steps**:
- Create `app/events/create/page.tsx` with stepper component
- Step 1 fields:
  - Event title (text input)
  - Description (rich text editor or textarea)
  - Category (select dropdown)
  - Tags (multi-select or comma-separated input)
  - Banner image upload (Cloudinary integration)
- Add image upload preview
- Form validation with Zod
- Store form data in React state
- "Next" button to proceed to Step 2

**Dependencies**: Task 3.1

**Files to Create**:
- `app/events/create/page.tsx`
- `components/events/create/EventDetailsStep.tsx`
- `components/events/create/CreateEventStepper.tsx`
