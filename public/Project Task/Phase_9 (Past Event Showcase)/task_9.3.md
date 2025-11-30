### Task 9.3: Add Showcase Creation UI to Event Management
**Description**: Create UI for event owners to generate showcases for their past events.

**Implementation Steps**:
- Create `components/events/manage/CreateShowcaseModal.tsx`:
  - Modal dialog for showcase creation
  - Form fields:
    - Showcase description (textarea)
    - Media upload (multiple images/videos)
    - Preview of showcase page
  - Submit to create showcase
  - Display generated showcase URL
  - Copy link button
- Add "Create Showcase" button to:
  - Event management dashboard (for completed events)
  - My Events page (Past tab)
- Create `components/events/manage/ShowcaseMediaUpload.tsx`:
  - Drag-and-drop file upload
  - Multiple file selection
  - Image preview thumbnails
  - Upload progress indicators
  - Cloudinary integration
  - File type validation (images and videos)
  - Max file size validation
- Create `components/events/manage/ShowcasePreview.tsx`:
  - Live preview of showcase page
  - Show how it will appear to public
  - Edit mode toggle
- Add showcase status indicator to event cards:
  - "Showcase Available" badge
  - View count display
  - Quick link to showcase

**Form Validation**:
```typescript
import { z } from 'zod'

const showcaseSchema = z.object({
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  mediaUrls: z.array(z.string().url())
    .min(1, 'At least one image is required')
    .max(20, 'Maximum 20 media files allowed')
})
```

**UI Flow**:
1. Owner clicks "Create Showcase" on past event
2. Modal opens with form
3. Owner enters description
4. Owner uploads images/videos (Cloudinary)
5. Preview updates in real-time
6. Owner clicks "Create Showcase"
7. API creates showcase and returns URL
8. Success message with shareable link
9. Option to view showcase or copy link

**Dependencies**: Task 9.1, Task 9.2

**Files to Create**:
- `components/events/manage/CreateShowcaseModal.tsx`
- `components/events/manage/ShowcaseMediaUpload.tsx`
- `components/events/manage/ShowcasePreview.tsx`
- `lib/validation/showcase.validation.ts`

**Files to Modify**:
- `app/events/[id]/manage/page.tsx` (add Create Showcase button)
- `app/my-events/page.tsx` (add showcase indicators)
- `components/events/EventCard.tsx` (add showcase badge)

**Testing**:
- [ ] Create showcase for past event
- [ ] Upload multiple images
- [ ] Verify preview accuracy
- [ ] Test form validation
- [ ] Verify showcase URL generation
- [ ] Test copy link functionality
