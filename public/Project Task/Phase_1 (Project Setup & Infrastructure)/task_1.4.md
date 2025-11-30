### Task 1.4: Initialize Prisma and Create Base Schema
**Description**: Set up Prisma ORM with initial database schema.

**Implementation Steps**:
- Run `npx prisma init`
- Create `prisma/schema.prisma` with:
  - PostgreSQL datasource configuration
  - Prisma Client generator
  - User model (id, email, password_hash, name, profile_image_url, bio, location, email_verified, verification_token, reset_token, reset_token_expires, created_at, updated_at, is_active)
- Add indexes on email and verification_token
- Run `npx prisma migrate dev --name init_users`
- Generate Prisma Client: `npx prisma generate`
- Create `lib/prisma.ts` with singleton Prisma Client instance

**Dependencies**: Task 1.3

**Files to Create**:
- `prisma/schema.prisma`
- `lib/prisma.ts`

---