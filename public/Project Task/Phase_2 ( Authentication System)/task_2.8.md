### Task 2.8: Build Password Reset Pages
**Description**: Create forgot password and reset password pages.

**Implementation Steps**:
- Create `app/(auth)/forgot-password/page.tsx`:
  - Email input form
  - Call forgot-password API
  - Show success message to check email
- Create `app/(auth)/reset-password/page.tsx`:
  - Extract token from URL
  - New password and confirm password fields
  - Call reset-password API
  - Redirect to login with success message
- Add password strength validation

**Dependencies**: Task 2.4

**Files to Create**:
- `app/(auth)/forgot-password/page.tsx`
- `app/(auth)/reset-password/page.tsx`