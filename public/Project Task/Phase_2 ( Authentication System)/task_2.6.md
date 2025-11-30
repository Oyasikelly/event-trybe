### Task 2.6: Build Login Page UI
**Description**: Create login page with NextAuth integration.

**Implementation Steps**:
- Create `app/(auth)/login/page.tsx`
- Build form with fields: email, password
- Add "Remember me" checkbox
- Handle form submission with `signIn` from next-auth/react
- Display error messages for invalid credentials
- Add links to: signup page, forgot password
- Show loading state during authentication
- Redirect to home page on success

**Dependencies**: Task 2.1, Task 2.5

**Files to Create**:
- `app/(auth)/login/page.tsx`