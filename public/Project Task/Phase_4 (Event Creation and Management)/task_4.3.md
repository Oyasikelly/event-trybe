### Task 4.3: Build Event Creation Form - Step 2 (Date, Time, Location)
**Description**: Create Step 2 of event creation wizard.

**Implementation Steps**:
- Step 2 fields:
  - Start date and time (date-time picker)
  - End date and time (date-time picker)
  - Timezone selector (dropdown with common timezones)
  - Location type radio: Physical or Virtual
  - Conditional fields:
    - If Physical: Address input (text)
    - If Virtual: Meeting link input (URL)
- Validate end time after start time
- Display timezone-aware preview
- "Back" and "Next" buttons

**Dependencies**: Task 4.2

**Files to Create**:
- `components/events/create/DateTimeLocationStep.tsx`