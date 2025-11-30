### Task 5.2: Implement Event Phase Filtering
**Description**: Add upcoming, ongoing, and past event filtering.

**Implementation Steps**:
- Modify `app/find-events/page.tsx` to handle tab changes
- Update API call to include phase parameter
- Display appropriate message for each tab
- For Past events tab:
  - Apply grayscale filter to event banners
  - Add "PAST EVENT" badge
  - Change CTA to "View Showcase" (if available)
  - Mute text colors
- Add event count badges to tabs
- Style active tab with underline indicator

**Dependencies**: Task 5.1

**Files to Modify**:
- `app/find-events/page.tsx`
- `components/events/EventCard.tsx` (add past event styling)