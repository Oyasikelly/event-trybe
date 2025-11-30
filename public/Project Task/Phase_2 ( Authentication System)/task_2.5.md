### Task 2.5: Build Sign Up Page UI
**Description**: Create user registration page with form validation.

**Implementation Steps**:
- Create `app/(auth)/signup/page.tsx`
- Build form with fields: email, password, confirm password, name, location (optional)
- Add client-side validation with React Hook Form and Zod
- Show password strength indicator
- Handle form submission:
  - Call signup API
  - Show success message with email verification prompt
  - Redirect to login page
- Add link to login page
- Style with Tailwind and Shadcn components

**Dependencies**: Task 2.2

**Files to Create**:
- `app/(auth)/signup/page.tsx`
- `app/(auth)/layout.tsx` (auth pages layout)
