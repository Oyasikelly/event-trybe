### Task 2.3: Create Email Verification API
**Description**: Build endpoint to verify user email with token.

**Implementation Steps**:
- Create `app/api/v1/auth/verify-email/route.ts`
- Implement POST handler:
  - Accept token in request body
  - Find user by verification_token
  - Check token expiration (24 hours)
  - Update user: emailVerified: true, verification_token: null
  - Return success response
- Handle error cases: invalid token, expired token, already verified

**Dependencies**: Task 2.2

**Files to Create**:
- `app/api/v1/auth/verify-email/route.ts`

---