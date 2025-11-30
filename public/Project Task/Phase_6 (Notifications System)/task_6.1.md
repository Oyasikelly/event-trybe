### Task 6.1: Create Notifications Database Schema and API
**Description**: Build the notifications system infrastructure with database models and core API endpoints.

**Implementation Steps**:
- Verify Prisma schema includes Notification model (should already exist from Phase 1)
- Create `lib/notifications/notification-service.ts`:
  - `createNotification(userId, type, title, message, link?, relatedEventId?, relatedRegistrationId?)`
  - `getUserNotifications(userId, filters)`
  - `markAsRead(notificationId, userId)`
  - `markAllAsRead(userId)`
  - `deleteNotification(notificationId, userId)`
- Create `app/api/v1/notifications/route.ts`:
  - GET: Fetch user notifications with pagination
  - Query params: `unread` (boolean), `limit` (number), `page` (number)
  - Return notifications with unread count
- Create `app/api/v1/notifications/[id]/read/route.ts`:
  - PUT: Mark single notification as read
  - Verify notification belongs to authenticated user
- Create `app/api/v1/notifications/read-all/route.ts`:
  - PUT: Mark all user notifications as read
  - Return count of marked notifications

**Technical Details**:
```typescript
// lib/notifications/notification-service.ts
import { prisma } from '@/lib/prisma'
import { NotificationType } from '@prisma/client'

export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
  relatedEventId,
  relatedRegistrationId
}: {
  userId: string
  type: NotificationType
  title: string
  message: string
  link?: string
  relatedEventId?: string
  relatedRegistrationId?: string
}) {
  return await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      link,
      relatedEventId,
      relatedRegistrationId
    }
  })
}
```

**Dependencies**: Task 1.7 (Prisma Schema)

**Files to Create**:
- `lib/notifications/notification-service.ts`
- `app/api/v1/notifications/route.ts`
- `app/api/v1/notifications/[id]/read/route.ts`
- `app/api/v1/notifications/read-all/route.ts`

**Testing Checklist**:
- [ ] Create notification via service
- [ ] Fetch notifications with filters
- [ ] Mark single notification as read
- [ ] Mark all notifications as read
- [ ] Verify authorization (users can only access their notifications)
