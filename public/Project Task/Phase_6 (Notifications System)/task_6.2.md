### Task 6.2: Build Notification UI Components
**Description**: Create reusable notification components for displaying notifications in the UI.

**Implementation Steps**:
- Create `components/notifications/NotificationBell.tsx`:
  - Bell icon with unread count badge
  - Click to open dropdown
  - Real-time unread count update
- Create `components/notifications/NotificationDropdown.tsx`:
  - Dropdown panel with notification list
  - "Mark all as read" button
  - "View all" link to full notifications page
  - Empty state when no notifications
  - Loading skeleton
- Create `components/notifications/NotificationItem.tsx`:
  - Notification icon based on type
  - Title and message display
  - Timestamp (relative time: "2 hours ago")
  - Unread indicator (blue dot or background)
  - Click to mark as read and navigate to link
- Create `components/notifications/NotificationIcon.tsx`:
  - Icon selector based on notification type
  - Color coding for different types

**UI Specifications**:
```typescript
// Notification type icons and colors
const NOTIFICATION_CONFIG = {
  new_registration: { icon: UserPlus, color: 'text-blue-500' },
  registration_confirmed: { icon: CheckCircle, color: 'text-green-500' },
  registration_accepted: { icon: ThumbsUp, color: 'text-green-500' },
  registration_rejected: { icon: XCircle, color: 'text-red-500' },
  event_reminder: { icon: Bell, color: 'text-amber-500' },
  event_updated: { icon: Edit, color: 'text-blue-500' },
  event_cancelled: { icon: AlertTriangle, color: 'text-red-500' },
  system_announcement: { icon: Megaphone, color: 'text-purple-500' }
}
```

**Styling Guidelines**:
- Unread notifications: Light blue background (#EFF6FF)
- Read notifications: White background
- Hover state: Subtle gray background
- Badge: Red background with white text
- Max dropdown height: 400px with scroll
- Notification item padding: 12px
- Timestamp: Gray-500, text-sm

**Dependencies**: Task 6.1

**Files to Create**:
- `components/notifications/NotificationBell.tsx`
- `components/notifications/NotificationDropdown.tsx`
- `components/notifications/NotificationItem.tsx`
- `components/notifications/NotificationIcon.tsx`
- `lib/utils/notification-helpers.ts` (helper functions)

**Integration Points**:
- Add NotificationBell to main navigation bar
- Fetch notifications on component mount
- Poll for new notifications every 30 seconds (or use WebSocket)
