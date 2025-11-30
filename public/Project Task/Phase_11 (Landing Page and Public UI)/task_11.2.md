### Task 11.2: Build Main Navigation Component
**Description**: Create the primary navigation bar with all menu items and responsive behavior.

**Implementation Steps**:
- Create `components/layout/Navbar.tsx`:
  - Logo/brand name (links to home)
  - Navigation menu items:
    - Home
    - Find Events
    - Create Event (authenticated only)
    - My Events (authenticated only)
    - My Registrations (authenticated only)
  - Right side:
    - Notifications bell (authenticated)
    - User avatar dropdown (authenticated)
    - Login/Signup buttons (guest)
  - Sticky navigation on scroll
  - Shadow on scroll
- Create `components/layout/MobileNav.tsx`:
  - Hamburger menu icon
  - Slide-out drawer navigation
  - Same menu items as desktop
  - Close button
- Create `components/layout/UserMenu.tsx`:
  - Dropdown menu from avatar
  - Profile link
  - Settings link
  - Logout button
- Create `components/layout/BottomNav.tsx` (mobile):
  - Fixed bottom navigation
  - 4-5 key actions with icons
  - Active state indicators

**Navigation Structure**:
```typescript
const navItems = [
  { label: 'Home', href: '/', public: true },
  { label: 'Find Events', href: '/find-events', public: true },
  { label: 'Create Event', href: '/events/create', auth: true },
  { label: 'My Events', href: '/my-events', auth: true },
  { label: 'My Registrations', href: '/my-registrations', auth: true }
]
```

**Responsive Behavior**:
- Desktop (>1024px): Full horizontal navigation
- Tablet (640-1024px): Condensed navigation with icons
- Mobile (<640px): Hamburger menu + bottom navigation

**Dependencies**: Phase 2 (Authentication), Phase 6 (Notifications)

**Files to Create**:
- `components/layout/Navbar.tsx`
- `components/layout/MobileNav.tsx`
- `components/layout/UserMenu.tsx`
- `components/layout/BottomNav.tsx`
- `components/layout/Logo.tsx`

**Files to Modify**:
- `app/layout.tsx` (add Navbar component)

**Testing**:
- [ ] Navigation displays correctly
- [ ] Links navigate properly
- [ ] Mobile menu opens/closes
- [ ] User menu dropdown works
- [ ] Authenticated vs guest views
- [ ] Sticky behavior on scroll
- [ ] Bottom nav on mobile
