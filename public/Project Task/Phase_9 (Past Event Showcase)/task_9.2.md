### Task 9.2: Build Public Showcase Page
**Description**: Create public-facing showcase page for past events.

**Implementation Steps**:
- Create `app/showcase/[slug]/page.tsx`:
  - Fetch showcase data by slug
  - Display event information
  - Show showcase media gallery
  - Display attendee count
  - Show event owner information
  - Increment view count
  - SEO optimization with meta tags
- Create `components/showcase/ShowcaseHero.tsx`:
  - Event banner with overlay
  - Event title and date
  - "Past Event" badge
  - Attendee count
  - Share buttons
- Create `components/showcase/MediaGallery.tsx`:
  - Grid layout for images/videos
  - Lightbox for full-size viewing
  - Responsive design
  - Support for images and embedded videos
- Create `components/showcase/EventSummary.tsx`:
  - Showcase description
  - Event highlights
  - Original event details
  - Owner's summary
- Create `components/showcase/ShareButtons.tsx`:
  - Share to social media (Twitter, Facebook, LinkedIn)
  - Copy link button
  - Embed code generator

**SEO Optimization**:
```typescript
// app/showcase/[slug]/page.tsx
import { Metadata } from 'next'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const showcase = await getShowcaseBySlug(params.slug)

  return {
    title: `${showcase.event.title} - Event Showcase`,
    description: showcase.showcaseDescription || showcase.event.description,
    openGraph: {
      title: showcase.event.title,
      description: showcase.showcaseDescription,
      images: [showcase.event.bannerImageUrl],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: showcase.event.title,
      description: showcase.showcaseDescription,
      images: [showcase.event.bannerImageUrl]
    }
  }
}
```

**UI Design**:
- Muted color scheme for past events
- Grayscale filter on banner (30% opacity)
- Prominent "Past Event" badge
- Gallery with 3-column grid (desktop)
- Mobile-responsive layout
- Smooth animations and transitions

**Dependencies**: Task 9.1

**Files to Create**:
- `app/showcase/[slug]/page.tsx`
- `components/showcase/ShowcaseHero.tsx`
- `components/showcase/MediaGallery.tsx`
- `components/showcase/EventSummary.tsx`
- `components/showcase/ShareButtons.tsx`

**Testing**:
- [ ] Access showcase via public URL
- [ ] Verify SEO meta tags
- [ ] Test social media sharing
- [ ] Verify view count increments
- [ ] Test responsive design
- [ ] Verify media gallery lightbox
