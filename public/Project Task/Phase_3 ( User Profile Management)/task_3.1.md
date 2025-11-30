### Task 3.1: Configure Cloudinary for Image Uploads
**Description**: Set up Cloudinary account and integration.

**Implementation Steps**:
- Sign up for Cloudinary account
- Create upload preset for profile images (400x400, circular crop)
- Create upload preset for event banners (1200x675, 16:9 ratio)
- Add environment variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- Install `cloudinary` npm package
- Create `lib/cloudinary.ts` with upload helper functions
- Configure transformations for optimization

**Dependencies**: Task 1.1

**Files to Create**:
- `lib/cloudinary.ts`

**Environment Variables**:
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=profile-images
```
