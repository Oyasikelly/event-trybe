### Task 3.2: Create Profile API Endpoints
**Description**: Build APIs for viewing and updating user profile.

**Implementation Steps**:
- Create `app/api/v1/users/profile/route.ts`:
  - GET: Return current authenticated user's profile (exclude password_hash)
  - PUT: Update user profile (name, bio, location)
  - Validate authentication with getServerSession
  - Validate input with Zod
- Create `app/api/v1/users/profile/image/route.ts`:
  - POST: Upload profile image to Cloudinary
  - Validate file type (images only) and size (max 5MB)
  - Update user profile_image_url in database
  - Return new image URL

**Dependencies**: Task 2.1, Task 3.1

**Files to Create**:
- `app/api/v1/users/profile/route.ts`
- `app/api/v1/users/profile/image/route.ts`

---