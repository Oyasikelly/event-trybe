### Task 2.7: Build Email Verification Page
**Description**: Create page to handle email verification from link.

**Implementation Steps**:
- Create `app/(auth)/verify-email/page.tsx`
- Extract token from URL query parameters
- Call verify-email API on mount
- Show loading spinner during verification
- Display success message with link to login
- Handle error states: invalid token, expired token
- Style with Shadcn Alert component

**Dependencies**: Task 2.3

**Files to Create**:
- `app/(auth)/verify-email/page.tsx`