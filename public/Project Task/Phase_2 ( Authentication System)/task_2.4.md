### Task 2.4: Create Password Reset API
**Description**: Build forgot password and reset password endpoints.

**Implementation Steps**:
- Create `app/api/v1/auth/forgot-password/route.ts`:
  - Accept email in request body
  - Find user by email
  - Generate reset token (crypto.randomBytes)
  - Set reset_token_expires (1 hour from now)
  - Queue password reset email
  - Return success (always, to prevent email enumeration)
- Create `app/api/v1/auth/reset-password/route.ts`:
  - Accept token and newPassword in request body
  - Find user by reset_token
  - Verify token not expired
  - Hash new password
  - Update user password, clear reset tokens
  - Return success response

**Dependencies**: Task 2.3

**Files to Create**:
- `app/api/v1/auth/forgot-password/route.ts`
- `app/api/v1/auth/reset-password/route.ts`
