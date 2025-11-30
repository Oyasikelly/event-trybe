### Task 1.1: Initialize Next.js Project
**Description**: Set up the Next.js 14+ project with TypeScript and App Router.

**Implementation Steps**:
- Run `npx create-next-app@latest` with TypeScript, ESLint, Tailwind CSS, App Router
- Configure `tsconfig.json` with strict mode
- Set up folder structure: `app/`, `components/`, `lib/`, `prisma/`
- Install core dependencies: `prisma`, `@prisma/client`, `next-auth`, `bcryptjs`, `zod`
- Create `.env.local` file with placeholder environment variables
- Set up `.gitignore` to exclude `.env.local` and `node_modules`

**Dependencies**: None

**Files to Create**:
- `next.config.js`
- `tsconfig.json`
- `.env.local`
- `package.json`

---