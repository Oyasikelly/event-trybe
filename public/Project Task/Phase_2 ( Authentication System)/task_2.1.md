### Task 2.1: Configure NextAuth.js
**Description**: Set up NextAuth.js with credentials provider and Prisma adapter.

**Implementation Steps**:
- Install dependencies: `next-auth`, `@next-auth/prisma-adapter`
- Create `app/api/auth/[...nextauth]/route.ts`
- Configure NextAuth with:
  - PrismaAdapter
  - CredentialsProvider for email/password
  - JWT strategy
  - Custom pages (signIn, error)
  - Session callback to include user data
- Add `NEXTAUTH_URL` and `NEXTAUTH_SECRET` to environment variables
- Create `lib/auth.ts` with helper functions: hashPassword, verifyPassword

**Dependencies**: Task 1.7

**Files to Create**:
- `app/api/auth/[...nextauth]/route.ts`
- `lib/auth.ts`

**Environment Variables**:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-key
```

---