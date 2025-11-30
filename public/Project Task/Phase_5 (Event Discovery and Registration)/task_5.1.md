### Task 5.1: Build Find Events Page - All Tab
**Description**: Create main event discovery interface.

**Implementation Steps**:
- Create `app/find-events/page.tsx`
- Add tab navigation: All, Upcoming, Ongoing, Past
- Implement search bar for keyword search
- Add filter sidebar:
  - Category dropdown
  - Location filter (optional)
  - Date range picker
  - Capacity availability toggle
- Display events in responsive grid
- Use EventCard component with appropriate styling
- Implement pagination or infinite scroll
- Show loading skeletons while fetching
- Empty state when no events found

**Dependencies**: Task 4.9

**Files to Create**:
- `app/find-events/page.tsx`
- `components/events/discovery/EventsGrid.tsx`
- `components/events/discovery/SearchFilters.tsx`