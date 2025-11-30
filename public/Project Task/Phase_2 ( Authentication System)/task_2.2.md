### Task 2.2: Create User Registration API
**Description**: Build signup API endpoint with email verification.

**Implementation Steps**:
- Create `app/api/v1/auth/signup/route.ts`
- Implement POST handler:
  - Validate input with Zod (email format, password strength, required fields)
  - Check for duplicate email
  - Hash password with bcrypt (12 salt rounds)
  - Generate verification token (crypto.randomBytes)
  - Create user in database with emailVerified: false
  - Queue verification email (implement basic version, will enhance later)
  - Return success response with userId
- Add rate limiting (5 attempts per 15 minutes per IP)

**Dependencies**: Task 2.1

**Files to Create**:
- `app/api/v1/auth/signup/route.ts`
- `lib/validation.ts` (Zod schemas)