### Task 3.3: Build User Profile Page
**Description**: Create page for users to view and edit their profile.

**Implementation Steps**:
- Create `app/profile/page.tsx`
- Protect route with authentication check
- Fetch user profile on page load
- Display profile information: avatar, name, email, bio, location
- Add "Edit Profile" button to open modal/form
- Build edit form with fields: name, bio, location, profile image upload
- Implement image upload with preview
- Call profile API to update
- Show success toast on save
- Style with Shadcn Card and Form components

**Dependencies**: Task 3.2

**Files to Create**:
- `app/profile/page.tsx`
- `components/profile/EditProfileForm.tsx`
- `components/profile/ImageUpload.tsx`