### Task 9.1: Create Showcase Link Generation System
**Description**: Build infrastructure for generating and managing showcase links for past events.

**Implementation Steps**:
- Create `lib/showcase/slug-generator.ts`:
  - `generateSlug(eventTitle)` - Create URL-friendly slug
  - Handle duplicate slugs with numeric suffixes
  - Validate slug format (lowercase, hyphens, alphanumeric)
- Create `app/api/v1/events/[id]/showcase/route.ts`:
  - POST: Create showcase link for past event
  - Verify user is event owner
  - Verify event status is 'completed'
  - Accept showcase description and media URLs
  - Generate unique slug
  - Create ShowcaseLink record
  - Return showcase URL
  - PUT: Update showcase details
  - DELETE: Remove showcase (make private)
- Update Events table:
  - Set `showcaseEnabled = true`
  - Store `showcaseDescription`
  - Store `showcaseMediaUrls` array
- Create `lib/showcase/showcase-service.ts`:
  - `createShowcase(eventId, description, mediaUrls)`
  - `updateShowcase(eventId, updates)`
  - `getShowcaseBySlug(slug)`
  - `incrementViewCount(showcaseId)`

**Slug Generation Logic**:
```typescript
// lib/showcase/slug-generator.ts
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60)
}

export async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug
  let counter = 1

  while (await slugExists(slug)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}
```

**Dependencies**: Task 4.5 (Event APIs)

**Files to Create**:
- `lib/showcase/slug-generator.ts`
- `lib/showcase/showcase-service.ts`
- `app/api/v1/events/[id]/showcase/route.ts`

**Testing**:
- [ ] Generate showcase for completed event
- [ ] Verify slug uniqueness
- [ ] Test slug generation with special characters
- [ ] Verify only event owners can create showcases
- [ ] Test showcase update and deletion
