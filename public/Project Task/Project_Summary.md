Event Management Platform - Technical Documentation
Document Control
VersionDateAuthorChanges1.0November 2025Development TeamInitial Release

Table of Contents

Project Overview
Core Features
Navigation Structure
Database Schema
API Endpoints
UI/UX Guidelines
Technology Stack
Workflows and Diagrams
Security Considerations
Scalability and Performance
Future Enhancements


1. Project Overview
1.1 Purpose
The Event Management Platform is a comprehensive web application designed to facilitate seamless event creation, management, and attendance. The platform empowers users to organize events while providing attendees with an intuitive discovery and registration experience.
1.2 Core Concepts
Single User Role Model: The platform operates on a unified user role system. Every registered user has the capability to create events, automatically becoming an "Event Owner" for those specific events. There are no separate admin or organizer roles—ownership is event-specific and dynamic.
Event Lifecycle Management: Events progress through distinct phases:

Upcoming: Events scheduled for the future
Ongoing: Events currently in progress
Past: Completed events with showcase capabilities

Registration Models: Event owners can choose between two registration approval modes:

Automated Mode: Registrations are automatically approved upon email confirmation
Manual Mode: Event owners review and manually approve or reject each registration

Capacity Management: Events support configurable capacity limits with real-time tracking of available slots, ensuring controlled attendance and preventing overbooking.
1.3 Key Capabilities

User-driven event creation and management
Flexible registration approval workflows
Automated email notifications and confirmations
Google Calendar integration for confirmed attendees
Past event showcase with embeddable links
Real-time analytics for event owners
Comprehensive event discovery interface


2. Core Features
2.1 User Authentication System
2.1.1 Registration and Onboarding

Email-based sign-up with password creation
Email verification link sent upon registration
Account activation required before platform access
Profile creation with customizable fields

2.1.2 Authentication Features

Secure login with email and password
Password reset via email link
Session management with secure token handling
Optional "Remember Me" functionality

2.1.3 User Profile Management

Profile image upload via Cloudinary integration
Editable fields: name, bio, location, contact information
Profile visibility settings
Account deactivation option

2.2 Event Creation and Configuration
2.2.1 Event Details

Event title and description (rich text editor support)
Event banner image upload (Cloudinary)
Date and time selection with timezone support
Location information (physical address or virtual link)
Event category/tags for discoverability

2.2.2 Registration Configuration

Approval Mode Selection:

Automated: Instant approval after email confirmation
Manual: Owner reviews each registration


Capacity Settings:

Maximum attendee limit
Optional minimum attendee threshold
Real-time capacity tracking


Registration Deadline: Cutoff date/time for new registrations

2.2.3 Event Status Management

Draft: Work-in-progress, not publicly visible
Published: Active and discoverable
Cancelled: Event cancelled with notification to registrants
Completed: Past event with showcase mode enabled

2.3 Event Management Dashboard
2.3.1 Owner Dashboard Features
Event owners access a comprehensive dashboard for each event:
Analytics Overview:

Total registrations count
Email confirmations completed
Pending confirmations
Capacity utilization (visual progress bar)
Acceptance/rejection statistics (manual mode)

Registration Management:

List of all registrants with status indicators
Filter by: pending, confirmed, accepted, rejected
Bulk actions for manual approval mode
Individual registration review with user profiles

Event Controls:

Edit event details
Change registration settings
Cancel event with attendee notification
Archive completed events
Generate showcase links for past events

2.3.2 Communication Tools

Send announcements to all confirmed attendees
Send custom messages to specific registrants
Access to email delivery status

2.4 Event Registration Flow
2.4.1 Registration Process
For Attendees:

Discover event through Find Events interface
Click "Register" button
Submit registration (authenticated users)
Receive email confirmation link
Confirm email address
Automated Mode: Automatically accepted, receive confirmation email with calendar invite
Manual Mode: Wait for owner approval, receive acceptance/rejection email

2.4.2 Registration States

Pending Email: User registered, email not confirmed
Pending Approval: Email confirmed, awaiting manual approval (manual mode only)
Confirmed/Accepted: Approved to attend
Rejected: Registration declined by owner (manual mode)
Cancelled: User cancelled their own registration

2.4.3 Capacity Handling

Real-time capacity checks during registration
"Event Full" indicator when capacity reached
Optional waitlist for full events (future enhancement)

2.5 Email Notification System
2.5.1 Automated Email Types
Authentication Emails:

Email verification link (registration)
Password reset link
Account activation confirmation

Registration Emails:

Registration confirmation with email verification link
Acceptance confirmation (automated or manual approval)
Rejection notification (manual mode only)
Event cancellation notice
Event update notifications

Reminder Emails:

24-hour event reminder to confirmed attendees
1-hour event reminder (optional)
Post-event survey or feedback request (optional)

2.5.2 Email Content Features

Personalized recipient name
Event details summary
Clear call-to-action buttons
Google Calendar invite attachment (for confirmed registrations)
Unsubscribe options where applicable
Responsive HTML templates

2.6 Google Calendar Integration
2.6.1 Calendar Features

Automatic ICS file generation for confirmed registrations
ICS file attached to acceptance emails
Event details synchronized: title, date, time, location, description
Optional direct "Add to Google Calendar" button in emails
Calendar update notifications if event details change

2.7 Event Discovery Interface
2.7.1 Find Events Tab
Filtering Options:

All Events: Complete event listing
Upcoming: Events scheduled for the future
Ongoing: Events currently in progress
Past: Completed events with showcase links

Search and Filter:

Keyword search across titles and descriptions
Category/tag filtering
Location-based filtering
Date range selection
Capacity availability filter

Event Cards:

Banner image
Event title and summary
Date, time, location
Capacity indicator
Registration status (Open, Full, Closed)
Visual distinction for past events (muted styling)

2.8 Past Event Showcase
2.8.1 Showcase Features

Event owners can generate public showcase links for completed events
Showcase pages include:

Event details and description
Photo gallery or embedded media
Attendee count (with privacy options)
Highlights or key moments
Owner's event summary


Shareable links for social media and portfolios
Embed code for external websites

2.8.2 UI Differentiation

Past events display with:

Muted color scheme or grayscale banner
"Past Event" badge
"View Showcase" button instead of "Register"
No capacity or registration information
Optional "Similar Upcoming Events" suggestions



2.9 My Events Dashboard
2.9.1 Organization Tabs

Upcoming: Events the user created that are scheduled for the future
Past: Completed events with performance metrics
Drafts: Unpublished events in progress
Archived: Events removed from active management

2.9.2 Event Management Actions

Quick edit button for each event
Duplicate event template
Delete or archive event
View detailed analytics
Generate showcase links for past events

2.10 My Registrations Dashboard
2.10.1 Registration Overview

List of all events the user has registered for
Status indicators for each registration
Upcoming events sorted by date
Past events attended

2.10.2 Registration Actions

Cancel registration (with confirmation)
Download calendar invite
View event details
Contact event owner
Provide feedback for past events (optional)

2.11 Notifications System
2.11.1 In-App Notifications

Real-time notification dropdown in navigation bar
Notification badge with unread count
Notification types:

New registration for owned events
Registration status updates (acceptance, rejection)
Event reminders
Event updates or cancellations
System announcements



2.11.2 Notification Management

Mark individual notifications as read
Mark all as read option
Notification preferences in user settings
Email notification opt-in/opt-out toggles


3. Navigation Structure
3.1 Primary Navigation Bar
The top-level navigation provides global access to core platform features:
Nav ItemDescriptionAccess LevelHomeLanding page with featured events and quick statsAll usersFind EventsEvent discovery interface with filteringAll usersCreate EventEvent creation wizardAuthenticated usersMy EventsEvents created by the userAuthenticated usersMy RegistrationsEvents the user has registered forAuthenticated usersNotificationsIn-app notification centerAuthenticated usersProfileUser profile and settingsAuthenticated users
3.2 Secondary Navigation (Tabs)
3.2.1 Find Events Tabs

All: Complete event listing across all time periods
Upcoming: Events scheduled for the future
Ongoing: Events currently in progress
Past: Completed events with showcase pages

3.2.2 My Events Tabs

Upcoming: Future events owned by the user
Past: Completed events with analytics and showcase options
Drafts: Unpublished events in progress
Archived: Events removed from active view

3.3 Mobile Navigation
For responsive mobile experience:

Hamburger menu for primary navigation
Bottom navigation bar for key actions (Home, Find, Create, Profile)
Swipe gestures for tab navigation
Collapsible sections for better space utilization


4. Database Schema
4.1 Database Overview
The platform uses Neon PostgreSQL as the primary database, managed through Prisma ORM for type-safe database access and migrations.
4.2 Entity Relationship Diagram
Users (1) ──────< (M) Events
  │                    │
  │                    │
  └──< (M) Registrations (M) >──┘
       │
       └──< (M) Notifications
       
Events (1) ──────< (M) ShowcaseLinks (optional separate table)
4.3 Table Definitions
4.3.1 Users Table
Stores user account information and authentication data.
FieldTypeConstraintsDescriptionidUUIDPRIMARY KEYUnique user identifieremailVARCHAR(255)UNIQUE, NOT NULLUser email addresspassword_hashVARCHAR(255)NOT NULLHashed passwordnameVARCHAR(255)NOT NULLUser's display nameprofile_image_urlTEXTNULLCloudinary image URLbioTEXTNULLUser biographylocationVARCHAR(255)NULLUser locationemail_verifiedBOOLEANDEFAULT FALSEEmail verification statusverification_tokenVARCHAR(255)NULLEmail verification tokenreset_tokenVARCHAR(255)NULLPassword reset tokenreset_token_expiresTIMESTAMPNULLReset token expirationcreated_atTIMESTAMPDEFAULT NOW()Account creation dateupdated_atTIMESTAMPDEFAULT NOW()Last profile updateis_activeBOOLEANDEFAULT TRUEAccount active status
Indexes:

idx_users_email on email
idx_users_verification_token on verification_token
idx_users_reset_token on reset_token

4.3.2 Events Table
Stores all event information and configuration.
FieldTypeConstraintsDescriptionidUUIDPRIMARY KEYUnique event identifierowner_idUUIDFOREIGN KEY (Users.id), NOT NULLEvent creatortitleVARCHAR(255)NOT NULLEvent titledescriptionTEXTNOT NULLEvent description (rich text)banner_image_urlTEXTNULLCloudinary banner image URLcategoryVARCHAR(100)NULLEvent categorytagsTEXT[]NULLArray of tagslocation_typeENUMNOT NULL'physical' or 'virtual'location_addressTEXTNULLPhysical addresslocation_virtual_linkTEXTNULLVirtual meeting linkstart_datetimeTIMESTAMPNOT NULLEvent start timeend_datetimeTIMESTAMPNOT NULLEvent end timetimezoneVARCHAR(50)NOT NULLEvent timezoneapproval_modeENUMNOT NULL'automated' or 'manual'capacity_limitINTEGERNULLMaximum attendees (NULL = unlimited)min_capacityINTEGERNULLMinimum attendees thresholdregistration_deadlineTIMESTAMPNULLRegistration cutoff datestatusENUMDEFAULT 'draft''draft', 'published', 'cancelled', 'completed'showcase_enabledBOOLEANDEFAULT FALSEPast event showcase enabledshowcase_descriptionTEXTNULLShowcase summaryshowcase_media_urlsTEXT[]NULLShowcase images/videoscreated_atTIMESTAMPDEFAULT NOW()Event creation dateupdated_atTIMESTAMPDEFAULT NOW()Last update datepublished_atTIMESTAMPNULLPublication date
Indexes:

idx_events_owner_id on owner_id
idx_events_start_datetime on start_datetime
idx_events_status on status
idx_events_category on category

Computed Fields (application-level):

event_phase: Calculated based on current time vs. start_datetime and end_datetime

Upcoming: current time < start_datetime
Ongoing: start_datetime ≤ current time < end_datetime
Past: current time ≥ end_datetime



4.3.3 Registrations Table
Tracks user registrations for events.
FieldTypeConstraintsDescriptionidUUIDPRIMARY KEYUnique registration identifierevent_idUUIDFOREIGN KEY (Events.id), NOT NULLAssociated eventuser_idUUIDFOREIGN KEY (Users.id), NOT NULLRegistered userregistration_statusENUMDEFAULT 'pending_email'See status values belowemail_confirmed_atTIMESTAMPNULLEmail confirmation timestampemail_confirmation_tokenVARCHAR(255)NULLConfirmation tokenapproval_statusENUMNULL'pending', 'accepted', 'rejected' (manual mode only)approved_atTIMESTAMPNULLApproval timestampapproved_byUUIDFOREIGN KEY (Users.id), NULLApproving owner IDrejection_reasonTEXTNULLReason for rejection (manual mode)cancelled_atTIMESTAMPNULLUser cancellation timestampcalendar_invite_sentBOOLEANDEFAULT FALSECalendar invite sent flagreminder_sent_24hBOOLEANDEFAULT FALSE24-hour reminder sentreminder_sent_1hBOOLEANDEFAULT FALSE1-hour reminder sentregistered_atTIMESTAMPDEFAULT NOW()Initial registration dateupdated_atTIMESTAMPDEFAULT NOW()Last status update
Registration Status Values:

pending_email: User registered, email not confirmed
pending_approval: Email confirmed, awaiting manual approval
confirmed: Accepted and confirmed (automated or manual)
rejected: Registration rejected by owner
cancelled: User cancelled registration

Indexes:

idx_registrations_event_id on event_id
idx_registrations_user_id on user_id
idx_registrations_status on registration_status
unique_registration UNIQUE (event_id, user_id)

4.3.4 Notifications Table
Stores in-app notifications for users.
FieldTypeConstraintsDescriptionidUUIDPRIMARY KEYUnique notification identifieruser_idUUIDFOREIGN KEY (Users.id), NOT NULLNotification recipienttypeENUMNOT NULLNotification type (see below)titleVARCHAR(255)NOT NULLNotification titlemessageTEXTNOT NULLNotification contentlinkTEXTNULLRelated resource linkrelated_event_idUUIDFOREIGN KEY (Events.id), NULLAssociated eventrelated_registration_idUUIDFOREIGN KEY (Registrations.id), NULLAssociated registrationis_readBOOLEANDEFAULT FALSERead statusread_atTIMESTAMPNULLRead timestampcreated_atTIMESTAMPDEFAULT NOW()Notification creation date
Notification Types:

new_registration: New registration for owned event
registration_confirmed: Registration email confirmed
registration_accepted: Registration approved
registration_rejected: Registration rejected
event_reminder: Upcoming event reminder
event_updated: Event details changed
event_cancelled: Event cancelled
system_announcement: Platform-wide announcement

Indexes:

idx_notifications_user_id on user_id
idx_notifications_is_read on is_read
idx_notifications_created_at on created_at

4.3.5 ShowcaseLinks Table (Optional)
Alternative to storing showcase data directly in Events table. Useful for tracking analytics on showcase views.
FieldTypeConstraintsDescriptionidUUIDPRIMARY KEYUnique showcase link identifierevent_idUUIDFOREIGN KEY (Events.id), UNIQUE, NOT NULLAssociated eventslugVARCHAR(255)UNIQUE, NOT NULLURL-friendly slugis_publicBOOLEANDEFAULT TRUEPublic visibilityview_countINTEGERDEFAULT 0Number of viewscreated_atTIMESTAMPDEFAULT NOW()Showcase creation dateupdated_atTIMESTAMPDEFAULT NOW()Last update
Indexes:

idx_showcase_slug on slug
idx_showcase_event_id on event_id

4.4 Relationships Summary
One-to-Many Relationships:

Users → Events (one user creates many events)
Events → Registrations (one event has many registrations)
Users → Registrations (one user has many registrations)
Users → Notifications (one user receives many notifications)
Events → Notifications (one event generates many notifications)
Events → ShowcaseLinks (one event has one showcase link)

Many-to-Many Relationships:

Users ↔ Events (through Registrations table)

4.5 Prisma Schema Example
prismagenerator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                  String          @id @default(uuid())
  email               String          @unique
  passwordHash        String          @map("password_hash")
  name                String
  profileImageUrl     String?         @map("profile_image_url")
  bio                 String?
  location            String?
  emailVerified       Boolean         @default(false) @map("email_verified")
  verificationToken   String?         @map("verification_token")
  resetToken          String?         @map("reset_token")
  resetTokenExpires   DateTime?       @map("reset_token_expires")
  createdAt           DateTime        @default(now()) @map("created_at")
  updatedAt           DateTime        @updatedAt @map("updated_at")
  isActive            Boolean         @default(true) @map("is_active")
  
  eventsOwned         Event[]         @relation("EventOwner")
  registrations       Registration[]
  notifications       Notification[]
  approvalsGiven      Registration[]  @relation("ApprovedBy")
  
  @@index([email])
  @@map("users")
}

model Event {
  id                    String          @id @default(uuid())
  ownerId               String          @map("owner_id")
  title                 String
  description           String
  bannerImageUrl        String?         @map("banner_image_url")
  category              String?
  tags                  String[]
  locationType          LocationType    @map("location_type")
  locationAddress       String?         @map("location_address")
  locationVirtualLink   String?         @map("location_virtual_link")
  startDatetime         DateTime        @map("start_datetime")
  endDatetime           DateTime        @map("end_datetime")
  timezone              String
  approvalMode          ApprovalMode    @map("approval_mode")
  capacityLimit         Int?            @map("capacity_limit")
  minCapacity           Int?            @map("min_capacity")
  registrationDeadline  DateTime?       @map("registration_deadline")
  status                EventStatus     @default(draft)
  showcaseEnabled       Boolean         @default(false) @map("showcase_enabled")
  showcaseDescription   String?         @map("showcase_description")
  showcaseMediaUrls     String[]        @map("showcase_media_urls")
  createdAt             DateTime        @default(now()) @map("created_at")
  updatedAt             DateTime        @updatedAt @map("updated_at")
  publishedAt           DateTime?       @map("published_at")
  
  owner                 User            @relation("EventOwner", fields: [ownerId], references: [id])
  registrations         Registration[]
  notifications         Notification[]
  showcaseLink          ShowcaseLink?
  
  @@index([ownerId])
  @@index([startDatetime])
  @@index([status])
  @@index([category])
  @@map("events")
}

model Registration {
  id                      String              @id @default(uuid())
  eventId                 String              @map("event_id")
  userId                  String              @map("user_id")
  registrationStatus      RegistrationStatus  @default(pending_email) @map("registration_status")
  emailConfirmedAt        DateTime?           @map("email_confirmed_at")
  emailConfirmationToken  String?             @map("email_confirmation_token")
  approvalStatus          ApprovalStatus?     @map("approval_status")
  approvedAt              DateTime?           @map("approved_at")
  approvedById            String?             @map("approved_by_id")
  rejectionReason         String?             @map("rejection_reason")
  cancelledAt             DateTime?           @map("cancelled_at")
  calendarInviteSent      Boolean             @default(false) @map("calendar_invite_sent")
  reminderSent24h         Boolean             @default(false) @map("reminder_sent_24h")
  reminderSent1h          Boolean             @default(false) @map("reminder_sent_1h")
  registeredAt            DateTime            @default(now()) @map("registered_at")
  updatedAt               DateTime            @updatedAt @map("updated_at")
  
  event                   Event               @relation(fields: [eventId], references: [id])
  user                    User                @relation(fields: [userId], references: [id])
  approvedBy              User?               @relation("ApprovedBy", fields: [approvedById], references: [id])
  notifications           Notification[]
  
  @@unique([eventId, userId])
  @@index([eventId])
  @@index([userId])
  @@index([registrationStatus])
  @@map("registrations")
}

model Notification {
  id                    String            @id @default(uuid())
  userId                String            @map("user_id")
  type                  NotificationType
  title                 String
  message               String
  link                  String?
  relatedEventId        String?           @map("related_event_id")
  relatedRegistrationId String?           @map("related_registration_id")
  isRead                Boolean           @default(false) @map("is_read")
  readAt                DateTime?         @map("read_at")
  createdAt             DateTime          @default(now()) @map("created_at")
  
  user                  User              @relation(fields: [userId], references: [id])
  relatedEvent          Event?            @relation(fields: [relatedEventId], references: [id])
  relatedRegistration   Registration?     @relation(fields: [relatedRegistrationId], references: [id])
  
  @@index([userId])
  @@index([isRead])
  @@index([createdAt])
  @@map("notifications")
}

model ShowcaseLink {
  id          String    @id @default(uuid())
  eventId     String    @unique @map("event_id")
  slug        String    @unique
  isPublic    Boolean   @default(true) @map("is_public")
  viewCount   Int       @default(0) @map("view_count")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")
  
  event       Event     @relation(fields: [eventId], references: [id])
  
  @@index([slug])
  @@map("showcase_links")
}

enum LocationType {
  physical
  virtual
}

enum ApprovalMode {
  automated
  manual
}

enum EventStatus {
  draft
  published
  cancelled
  completed
}

enum RegistrationStatus {
  pending_email
  pending_approval
  confirmed
  rejected
  cancelled
}

enum ApprovalStatus {
  pending
  accepted
  rejected
}

enum NotificationType {
  new_registration
  registration_confirmed
  registration_accepted
  registration_rejected
  event_reminder
  event_updated
  event_cancelled
  system_announcement
}

5. API Endpoints
5.1 API Architecture
The platform uses a RESTful API design with Next.js App Router API routes. All endpoints return JSON responses and follow standard HTTP status codes.
Base URL: /api/v1
Authentication: JWT tokens stored in HTTP-only cookies, with CSRF protection enabled.
5.2 Authentication Endpoints
POST /api/v1/auth/signup
Purpose: Register a new user account
Request Body:
json{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "location": "New York, NY"
}
Response (201 Created):
json{
  "success": true,
  "message": "Account created. Please check your email to verify.",
  "userId": "uuid-here"
}
Validation:

Email format validation
Password strength requirements (min 8 characters, uppercase, lowercase, number)
Duplicate email check


POST /api/v1/auth/login
Purpose: Authenticate user and create session
Request Body:
json{
  "email": "user@example.com",
  "password": "securePassword123"
}
Response (200 OK):
json{
  "success": true,
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "profileImageUrl": "https://cloudinary.com/...",
    "emailVerified": true
  },
  "token": "jwt-token-here"
}

POST /api/v1/auth/logout
Purpose: End user session
Response (200 OK):
json{
  "success": true,
  "message": "Logged out successfully"
}

POST /api/v1/auth/verify-email
Purpose: Verify user email with token
Request Body:
json{
  "token": "verification-token-here"
}
Response (200 OK):
json{
  "success": true,
  "message": "Email verified successfully"
}

POST /api/v1/auth/forgot-password
Purpose: Initiate password reset process
Request Body:
json{
  "email": "user@example.com"
}
Response (200 OK):
json{
  "success": true,
  "message": "Password reset link sent to your email"
}

POST /api/v1/auth/reset-password
Purpose: Reset password with token
Request Body:
json{
  "token": "reset-token-here",
  "newPassword": "newSecurePassword123"
}
Response (200 OK):
json{
  "success": true,
  "message": "Password reset successfully"
}

5.3 User Profile Endpoints
GET /api/v1/users/profile
Purpose: Get current user profile
Headers: Authorization: Bearer {token}
Response (200 OK):
json{
  "id": "uuid-here",
  "email": "user@example.com",
  "name": "John Doe",
  "profileImageUrl": "https://cloudinary.com/...",
  "bio": "Event enthusiast",
  "location": "New York, NY",
  "emailVerified": true,
  "createdAt": "2025-01-15T10:00:00Z"
}

PUT /api/v1/users/profile
Purpose: Update user profile
Headers: Authorization: Bearer {token}
Request Body:
json{
  "name": "John Updated",
  "bio": "Updated bio",
  "location": "Los Angeles, CA"
}
Response (200 OK):
json{
  "success": true,
  "user": { /* updated user object */ }
}

POST /api/v1/users/profile/image
Purpose: Upload profile image
Headers:

Authorization: Bearer {token}
Content-Type: multipart/form-data

Request Body: FormData with image file
Response (200 OK):
json{
  "success": true,
  "imageUrl": "https://res.cloudinary.com/..."
}

5.4 Event Endpoints
POST /api/v1/events
Purpose: Create a new event
Headers: Authorization: Bearer {token}
Request Body:
json{
  "title": "Tech Conference 2025",
  "description": "Annual technology conference...",
  "bannerImageUrl": "https://cloudinary.com/...",
  "category": "Technology",
  "tags": ["tech", "conference", "networking"],
  "locationType": "physical",
  "locationAddress": "123 Main St, New York, NY",
  "startDatetime": "2025-06-15T09:00:00Z",
  "endDatetime": "2025-06-15T17:00:00Z",
  "timezone": "America/New_York",
  "approvalMode": "automated",
  "capacityLimit": 200,
  "registrationDeadline": "2025-06-14T23:59:59Z",
  "status": "published"
}
Response (201 Created):
json{OKContinue"success": true,
"event": {
"id": "event-uuid",
"title": "Tech Conference 2025",
/* ...other fields */
}
}

---

#### GET `/api/v1/events`
**Purpose**: Get all events with filtering

**Query Parameters**:
- `status` (optional): draft, published, cancelled, completed
- `phase` (optional): upcoming, ongoing, past
- `category` (optional): category filter
- `search` (optional): keyword search
- `page` (optional): pagination page number
- `limit` (optional): results per page (default: 20)

**Response** (200 OK):
```json
{
  "events": [
    {
      "id": "event-uuid",
      "title": "Tech Conference 2025",
      "bannerImageUrl": "https://cloudinary.com/...",
      "startDatetime": "2025-06-15T09:00:00Z",
      "location": "New York, NY",
      "capacityLimit": 200,
      "registrationCount": 150,
      "phase": "upcoming",
      "owner": {
        "id": "user-uuid",
        "name": "John Doe"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

#### GET `/api/v1/events/:id`
**Purpose**: Get single event details

**Response** (200 OK):
```json
{
  "id": "event-uuid",
  "title": "Tech Conference 2025",
  "description": "Full description...",
  "bannerImageUrl": "https://cloudinary.com/...",
  "category": "Technology",
  "tags": ["tech", "conference"],
  "locationType": "physical",
  "locationAddress": "123 Main St, New York, NY",
  "startDatetime": "2025-06-15T09:00:00Z",
  "endDatetime": "2025-06-15T17:00:00Z",
  "timezone": "America/New_York",
  "approvalMode": "automated",
  "capacityLimit": 200,
  "registrationCount": 150,
  "confirmedCount": 145,
  "phase": "upcoming",
  "owner": {
    "id": "user-uuid",
    "name": "John Doe",
    "profileImageUrl": "https://cloudinary.com/..."
  },
  "userRegistrationStatus": "confirmed" // if user is authenticated
}
```

---

#### PUT `/api/v1/events/:id`
**Purpose**: Update event details

**Headers**: `Authorization: Bearer {token}`

**Request Body**: Same as create, with fields to update

**Response** (200 OK):
```json
{
  "success": true,
  "event": { /* updated event object */ }
}
```

**Authorization**: Only event owner can update

---

#### DELETE `/api/v1/events/:id`
**Purpose**: Delete or cancel event

**Headers**: `Authorization: Bearer {token}`

**Query Parameters**:
- `action` (optional): "cancel" or "delete" (default: cancel)

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Event cancelled. Attendees have been notified."
}
```

**Authorization**: Only event owner can delete

---

#### GET `/api/v1/events/:id/registrations`
**Purpose**: Get all registrations for an event

**Headers**: `Authorization: Bearer {token}`

**Query Parameters**:
- `status` (optional): Filter by registration status

**Response** (200 OK):
```json
{
  "registrations": [
    {
      "id": "registration-uuid",
      "user": {
        "id": "user-uuid",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "profileImageUrl": "https://cloudinary.com/..."
      },
      "registrationStatus": "confirmed",
      "emailConfirmedAt": "2025-05-01T10:30:00Z",
      "registeredAt": "2025-05-01T10:00:00Z"
    }
  ],
  "stats": {
    "total": 150,
    "pendingEmail": 5,
    "pendingApproval": 0,
    "confirmed": 145,
    "rejected": 0,
    "cancelled": 3
  }
}
```

**Authorization**: Only event owner can access

---

#### GET `/api/v1/events/:id/analytics`
**Purpose**: Get event analytics

**Headers**: `Authorization: Bearer {token}`

**Response** (200 OK):
```json
{
  "totalRegistrations": 150,
  "emailConfirmations": 145,
  "pendingConfirmations": 5,
  "capacityUsed": 150,
  "capacityLimit": 200,
  "capacityPercentage": 75,
  "registrationsByDay": [
    {"date": "2025-05-01", "count": 20},
    {"date": "2025-05-02", "count": 35}
  ]
}
```

**Authorization**: Only event owner can access

---

### 5.5 Registration Endpoints

#### POST `/api/v1/registrations`
**Purpose**: Register for an event

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "eventId": "event-uuid"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to confirm.",
  "registration": {
    "id": "registration-uuid",
    "registrationStatus": "pending_email"
  }
}
```

**Errors**:
- 400: Event at capacity
- 400: Registration deadline passed
- 409: Already registered

---

#### POST `/api/v1/registrations/confirm-email`
**Purpose**: Confirm registration email

**Request Body**:
```json
{
  "token": "email-confirmation-token"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Email confirmed. Your registration is now active.",
  "autoApproved": true // or false for manual mode
}
```

---

#### POST `/api/v1/registrations/:id/approve`
**Purpose**: Approve a registration (manual mode only)

**Headers**: `Authorization: Bearer {token}`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Registration approved. Attendee notified."
}
```

**Authorization**: Only event owner can approve

---

#### POST `/api/v1/registrations/:id/reject`
**Purpose**: Reject a registration (manual mode only)

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "reason": "Event capacity reached"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Registration rejected. Attendee notified."
}
```

**Authorization**: Only event owner can reject

---

#### DELETE `/api/v1/registrations/:id`
**Purpose**: Cancel user's own registration

**Headers**: `Authorization: Bearer {token}`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Registration cancelled successfully"
}
```

---

#### GET `/api/v1/users/registrations`
**Purpose**: Get current user's registrations

**Headers**: `Authorization: Bearer {token}`

**Query Parameters**:
- `status` (optional): Filter by status
- `phase` (optional): upcoming, past

**Response** (200 OK):
```json
{
  "registrations": [
    {
      "id": "registration-uuid",
      "registrationStatus": "confirmed",
      "event": {
        "id": "event-uuid",
        "title": "Tech Conference 2025",
        "startDatetime": "2025-06-15T09:00:00Z",
        "bannerImageUrl": "https://cloudinary.com/...",
        "phase": "upcoming"
      }
    }
  ]
}
```

---

### 5.6 Notification Endpoints

#### GET `/api/v1/notifications`
**Purpose**: Get user notifications

**Headers**: `Authorization: Bearer {token}`

**Query Parameters**:
- `unread` (optional): true/false
- `limit` (optional): number of results

**Response** (200 OK):
```json
{
  "notifications": [
    {
      "id": "notification-uuid",
      "type": "new_registration",
      "title": "New Registration",
      "message": "Jane Smith registered for Tech Conference 2025",
      "link": "/events/event-uuid/registrations",
      "isRead": false,
      "createdAt": "2025-05-15T14:30:00Z"
    }
  ],
  "unreadCount": 5
}
```

---

#### PUT `/api/v1/notifications/:id/read`
**Purpose**: Mark notification as read

**Headers**: `Authorization: Bearer {token}`

**Response** (200 OK):
```json
{
  "success": true
}
```

---

#### PUT `/api/v1/notifications/read-all`
**Purpose**: Mark all notifications as read

**Headers**: `Authorization: Bearer {token}`

**Response** (200 OK):
```json
{
  "success": true,
  "markedCount": 12
}
```

---

### 5.7 Calendar Integration Endpoints

#### GET `/api/v1/calendar/event/:registrationId/ics`
**Purpose**: Generate ICS calendar file

**Headers**: `Authorization: Bearer {token}`

**Response** (200 OK):
- Content-Type: text/calendar
- Returns ICS file for download

---

#### POST `/api/v1/calendar/google-add`
**Purpose**: Add event to Google Calendar

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "registrationId": "registration-uuid"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "googleEventId": "google-event-id",
  "calendarLink": "https://calendar.google.com/..."
}
```

---

### 5.8 Showcase Endpoints

#### POST `/api/v1/events/:id/showcase`
**Purpose**: Generate showcase link for past event

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "showcaseDescription": "Amazing event with 200 attendees",
  "showcaseMediaUrls": [
    "https://cloudinary.com/photo1",
    "https://cloudinary.com/photo2"
  ]
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "showcaseUrl": "/showcase/tech-conference-2025",
  "slug": "tech-conference-2025"
}
```

**Authorization**: Only event owner can create

---

#### GET `/api/v1/showcase/:slug`
**Purpose**: Get public showcase page data

**Response** (200 OK):
```json
{
  "event": {
    "title": "Tech Conference 2025",
    "description": "...",
    "showcaseDescription": "Amazing event...",
    "showcaseMediaUrls": ["..."],
    "startDatetime": "2025-06-15T09:00:00Z",
    "attendeeCount": 195,
    "owner": {
      "name": "John Doe"
    }
  },
  "viewCount": 342
}
```

---

### 5.9 Error Response Format

All API errors follow a consistent format:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
```

**Common Error Codes**:
- `VALIDATION_ERROR` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `CONFLICT` (409)
- `RATE_LIMIT_EXCEEDED` (429)
- `INTERNAL_ERROR` (500)

---

## 6. UI/UX Guidelines

### 6.1 Design Principles

The platform follows modern web design principles with emphasis on clarity, accessibility, and visual engagement. The design system prioritizes user experience while maintaining professional aesthetics suitable for event management.

**Core Principles**:
- **Clarity**: Clear visual hierarchy with intuitive navigation
- **Consistency**: Unified design language across all interfaces
- **Accessibility**: WCAG 2.1 AA compliance for inclusive access
- **Responsiveness**: Mobile-first design with seamless cross-device experience
- **Performance**: Optimized loading with progressive enhancement

### 6.2 Color Palette

**Primary Colors**:
- Primary: `#2563EB` (Blue-600) - CTAs, active states
- Primary Dark: `#1E40AF` (Blue-700) - Hover states
- Primary Light: `#DBEAFE` (Blue-100) - Backgrounds

**Semantic Colors**:
- Success: `#10B981` (Green-500) - Confirmations, success messages
- Warning: `#F59E0B` (Amber-500) - Warnings, pending states
- Error: `#EF4444` (Red-500) - Errors, rejections, cancellations
- Info: `#3B82F6` (Blue-500) - Informational messages

**Neutral Colors**:
- Text Primary: `#111827` (Gray-900)
- Text Secondary: `#6B7280` (Gray-500)
- Background: `#FFFFFF` (White)
- Background Secondary: `#F9FAFB` (Gray-50)
- Border: `#E5E7EB` (Gray-200)

**Past Event Styling**:
- Muted Banner Overlay: `rgba(0, 0, 0, 0.4)` with grayscale filter
- Past Event Badge: `#9CA3AF` (Gray-400)

### 6.3 Typography

**Font Family**: Inter (sans-serif) for clean, modern readability

**Type Scale**:
- H1: 36px/40px (font-bold) - Page titles
- H2: 30px/36px (font-semibold) - Section headers
- H3: 24px/32px (font-semibold) - Card titles
- H4: 20px/28px (font-medium) - Subheadings
- Body Large: 18px/28px (font-normal) - Emphasis text
- Body: 16px/24px (font-normal) - Default text
- Body Small: 14px/20px (font-normal) - Secondary text
- Caption: 12px/16px (font-normal) - Labels, metadata

### 6.4 Event Card Design

Event cards are the primary visual component for event discovery and listing.

#### 6.4.1 Current/Upcoming Event Card

**Layout Structure**:
┌─────────────────────────────────────┐
│   Banner Image (16:9 aspect ratio)  │
│                                      │
├─────────────────────────────────────┤
│ [Category Badge]    [Capacity Bar]  │
│                                      │
│ Event Title                          │
│ Brief description excerpt...         │
│                                      │
│ 📅 Jun 15, 2025 • 9:00 AM           │
│ 📍 New York, NY                      │
│                                      │
│ 👤 150/200 registered                │
│                                      │
│ [Register Button - Primary]          │
└─────────────────────────────────────┘

**Design Specifications**:
- Card Border: 1px solid border with rounded corners (8px)
- Hover Effect: Subtle shadow elevation and border color change
- Banner: Full-width responsive image with object-fit: cover
- Category Badge: Small pill badge (top-left overlay on banner)
- Capacity Bar: Thin horizontal progress bar (if near capacity)
- Register Button: Full-width primary button with icon

**States**:
- **Open Registration**: Primary blue button "Register Now"
- **Event Full**: Disabled gray button "Event Full"
- **Registration Closed**: Disabled button "Registration Closed"
- **Already Registered**: Success green button "Registered ✓"

#### 6.4.2 Past Event Card

**Visual Differentiation**:
┌─────────────────────────────────────┐
│   Grayscale Banner + Dark Overlay   │
│   [PAST EVENT Badge - top-right]    │
├─────────────────────────────────────┤
│ Event Title (muted text color)      │
│ Brief description excerpt...         │
│                                      │
│ ✓ Completed Jun 15, 2025            │
│ 📍 New York, NY                      │
│                                      │
│ 195 attendees                        │
│                                      │
│ [View Showcase - Secondary Button]   │
└─────────────────────────────────────┘

**Design Changes from Current Events**:
- Banner: Grayscale filter (100%) with 40% dark overlay
- "PAST EVENT" badge in gray (#9CA3AF) on banner
- Text colors muted to gray-600 instead of gray-900
- No capacity information shown
- No registration button
- "View Showcase" secondary button (if showcase enabled)
- Reduced visual prominence overall

### 6.5 Dashboard Layouts

#### 6.5.1 Event Owner Dashboard

**Hero Section**:
- Event banner as background with gradient overlay
- Event title and key metrics overlay
- Quick action buttons (Edit, Share, Cancel)

**Analytics Grid**:
┌──────────────┬──────────────┬──────────────┐
│ Total Regs   │ Confirmed    │ Capacity     │
│   150        │   145        │   75%        │
└──────────────┴──────────────┴──────────────┘

**Registrations Table**:
- Filterable list with user avatars
- Status badges (color-coded)
- Action buttons (Approve/Reject for manual mode)
- Search and pagination

**Recent Activity Feed**:
- Timeline of recent registrations
- Email confirmation notifications
- Timestamp display

#### 6.5.2 My Events Dashboard

**Tab Navigation**:
- Horizontal tabs with active underline indicator
- Count badges showing number of events per tab

**Event Grid**:
- Responsive grid (3 columns desktop, 2 tablet, 1 mobile)
- Event cards with quick actions overlay on hover
- Empty state illustration when no events

**Quick Create Button**:
- Floating action button (FAB) bottom-right
- Primary color with shadow
- Icon: Plus symbol

### 6.6 Email Templates

All emails use responsive HTML templates with consistent branding.

#### 6.6.1 Email Verification Template

**Subject**: Verify Your Email Address

**Content Structure**:
[Logo]
Hi [Name],
Welcome to [Platform Name]! Please verify your email address to complete your registration.
[Verify Email Button - Primary]
Or copy this link: [verification-url]
This link expires in 24 hours.

[Footer with unsubscribe link]

#### 6.6.2 Registration Confirmation Template

**Subject**: Confirm Your Registration - [Event Title]

**Content**:
[Logo]
Hi [Name],
You've registered for [Event Title]!
Event Details:
📅 [Date and Time]
📍 [Location]
Please confirm your email to complete registration:
[Confirm Email Button - Primary]
[Automated Mode]: You'll be automatically confirmed once you verify.
[Manual Mode]: The event owner will review your registration.

[Event banner image]
[Footer]

#### 6.6.3 Acceptance Email Template (with Calendar Invite)

**Subject**: You're Confirmed! - [Event Title]

**Content**:
[Logo]
Great news, [Name]!
Your registration for [Event Title] has been confirmed.
Event Details:
📅 [Date and Time]
📍 [Location]
[Add to Google Calendar Button]
A calendar invite is attached to this email.
We look forward to seeing you there!
[View Event Details Button - Secondary]

[Footer]

**Attachment**: `event.ics` file

#### 6.6.4 Rejection Email Template

**Subject**: Registration Update - [Event Title]

**Content**:
[Logo]
Hi [Name],
Thank you for your interest in [Event Title].
Unfortunately, we're unable to accept your registration at this time.
[If reason provided]:
Reason: [Rejection reason]
We hope you'll join us at future events.
[Browse Other Events Button]

[Footer]

#### 6.6.5 Event Reminder Template

**Subject**: Reminder: [Event Title] is Tomorrow!

**Content**:
[Logo]
Hi [Name],
Just a friendly reminder that [Event Title] is happening tomorrow!
Event Details:
📅 [Date and Time]
📍 [Location]
[View Event Details Button]
[Add to Calendar Button]
See you there!

[Footer]

### 6.7 Interactive Components

#### 6.7.1 Capacity Progress Bar

Visual indicator showing event capacity utilization:

**Color Coding**:
- 0-50%: Green (#10B981)
- 51-80%: Amber (#F59E0B)
- 81-95%: Orange (#F97316)
- 96-100%: Red (#EF4444)

**Display**:
Registration Capacity
[████████████░░░░░░░░] 150/200 (75%)

#### 6.7.2 Status Badges

**Registration Status**:
- Pending Email: Yellow badge with clock icon
- Pending Approval: Blue badge with review icon
- Confirmed: Green badge with check icon
- Rejected: Red badge with X icon
- Cancelled: Gray badge with cancel icon

**Event Status**:
- Draft: Gray outlined badge
- Published: Green filled badge
- Cancelled: Red outlined badge
- Completed: Blue outlined badge

#### 6.7.3 Toast Notifications

Brief messages appearing at top-right of screen:

**Types**:
- Success: Green with check icon
- Error: Red with alert icon
- Info: Blue with info icon
- Warning: Amber with warning icon

**Duration**: Auto-dismiss after 5 seconds

### 6.8 Responsive Breakpoints

**Mobile**: < 640px
- Single column layouts
- Stacked navigation
- Full-width cards
- Bottom navigation bar

**Tablet**: 640px - 1024px
- Two-column grids
- Collapsible side navigation
- Adaptive card sizing

**Desktop**: > 1024px
- Three-column grids
- Persistent side navigation
- Full dashboard layouts
- Hover interactions

### 6.9 Accessibility Guidelines

**Keyboard Navigation**:
- Tab order follows visual hierarchy
- Skip navigation links
- Focus indicators clearly visible

**Screen Reader Support**:
- Semantic HTML elements
- ARIA labels for interactive elements
- Alt text for all images
- Descriptive link text

**Color Contrast**:
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text
- Never rely on color alone for information

**Form Accessibility**:
- Clear labels for all inputs
- Error messages associated with fields
- Required field indicators
- Inline validation feedback

---

## 7. Technology Stack

### 7.1 Frontend Framework

**Next.js 14+ (App Router)**

Next.js provides a comprehensive full-stack framework with server-side rendering, API routes, and optimized performance.

**Key Features Utilized**:
- App Router for file-based routing
- Server Components for improved performance
- API Routes for backend functionality
- Image optimization with next/image
- Built-in SEO optimization
- Incremental Static Regeneration (ISR) for event pages

**Folder Structure**:
app/
├── (auth)/
│   ├── login/
│   ├── signup/
│   └── verify-email/
├── (dashboard)/
│   ├── my-events/
│   ├── my-registrations/
│   └── notifications/
├── events/
│   ├── [id]/
│   └── create/
├── find-events/
├── profile/
├── showcase/[slug]/
├── api/
│   └── v1/
│       ├── auth/
│       ├── events/
│       ├── registrations/
│       └── notifications/
└── layout.tsx

### 7.2 Database and ORM

**Neon PostgreSQL**

Serverless PostgreSQL database with automatic scaling and branching capabilities.

**Benefits**:
- Serverless architecture with automatic scaling
- Database branching for development/staging
- Connection pooling built-in
- Compatible with Prisma ORM
- Cost-effective pay-per-use model

**Prisma ORM**

Type-safe database client with intuitive API and migration management.

**Configuration** (`prisma/schema.prisma`):
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

**Migration Workflow**:
```bash
# Create migration
npx prisma migrate dev --name add_showcase_links

# Apply migrations to production
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

### 7.3 Authentication

**NextAuth.js (Auth.js)**

Comprehensive authentication solution for Next.js applications.

**Configuration** (`app/api/auth/[...nextauth]/route.ts`):
```typescript
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { verifyPassword } from "@/lib/auth"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        
        if (!user || !user.emailVerified) return null
        
        const isValid = await verifyPassword(
          credentials.password,
          user.passwordHash
        )
        
        if (!isValid) return null
        
        return {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
    error: "/login"
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### 7.4 Email Service

**Resend**

Modern email API with React email template support.

**Configuration**:
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(
  email: string,
  token: string,
  name: string
) {
  const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`
  
  await resend.emails.send({
    from: 'Events Platform <noreply@yourdomain.com>',
    to: email,
    subject: 'Verify Your Email Address',
    html: renderVerificationTemplate(name, verificationUrl)
  })
}
```

**Alternative**: Nodemailer with Mailgun SMTP for higher volume requirements.

### 7.5 Background Jobs

**Upstash QStash**

Serverless message queue and scheduler for background tasks.

**Use Cases**:
- Send reminder emails 24 hours before events
- Update event status (upcoming → ongoing → past)
- Clean up expired verification tokens
- Generate analytics reports

**Configuration**:
```typescript
import { Client } from "@upstash/qstash"

const qstash = new Client({
  token: process.env.QSTASH_TOKEN
})

// Schedule reminder email
export async function scheduleEventReminder(
  eventId: string,
  reminderTime: Date
) {
  await qstash.publishJSON({
    url: `${process.env.APP_URL}/api/jobs/send-reminder`,
    body: { eventId },
    notBefore: Math.floor(reminderTime.getTime() / 1000)
  })
}
```

**Alternative**: Inngest for more complex workflow orchestration.

### 7.6 UI Components

**Tailwind CSS**

Utility-first CSS framework for rapid UI development.

**Configuration** (`tailwind.config.ts`):
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          // ... blue color scale
          600: '#2563eb',
          700: '#1e40af',
        }
      }
    }
  }
}
```

**Shadcn/UI**

High-quality, accessible component library built on Radix UI.

**Installed Components**:
- Button, Input, Textarea
- Dialog, Dropdown Menu
- Card, Badge, Avatar
- Tabs, Select, Calendar
- Toast, Alert

**Usage Example**:
```typescript
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function EventCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tech Conference 2025</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Event details...</p>
      </CardContent>
      <CardFooter>
        <Button>Register Now</Button>
      </CardFooter>
    </Card>
  )
}
```

### 7.7 File Upload

**Cloudinary**

Cloud-based image and video management platform.

**Configuration**:
```typescript
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function uploadImage(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'events',
        transformation: [
          { width: 1200, height: 675, crop: 'limit' },
          { quality: 'auto' }
        ]
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result.secure_url)
      }
    ).end(buffer)
  })
}
```

**Upload Presets**:
- Event banners: 1200x675px (16:9)
- Profile images: 400x400px (1:1)
- Showcase media: 1920x1080px (16:9)

### 7.8 Calendar Integration

**Google Calendar API**

Integration for adding events to user calendars.

**ICS File Generation**:
```typescript
import ical from 'ical-generator'

export function generateICS(event: Event, user: User) {
  const calendar = ical({ name: 'Event Calendar' })
  
  calendar.createEvent({
    start: event.startDatetime,
    end: event.endDatetime,
    summary: event.title,
    description: event.description,OKContinuelocation: event.locationAddress || event.locationVirtualLink,
organizer: {
  name: event.owner.name,
  email: event.owner.email
},
attendees: [{
  name: user.name,
  email: user.email
}]
})
return calendar.toString()
}

### 7.9 Deployment

**Vercel**

Optimized hosting platform for Next.js applications.

**Deployment Configuration** (`vercel.json`):
```json
{
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret",
    "CLOUDINARY_CLOUD_NAME": "@cloudinary-cloud-name"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_APP_URL": "https://yourdomain.com"
    }
  }
}
```

**Environment Variables**:
```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="..."

# Email
RESEND_API_KEY="..."

# Cloud Storage
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Background Jobs
QSTASH_TOKEN="..."
QSTASH_CURRENT_SIGNING_KEY="..."
QSTASH_NEXT_SIGNING_KEY="..."

# Google Calendar
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

### 7.10 Development Tools

**TypeScript**

Type-safe development with enhanced IDE support.

**ESLint + Prettier**

Code quality and formatting consistency.

**Husky + Lint-Staged**

Pre-commit hooks for code quality checks.

**Package Manager**: pnpm for faster, more efficient dependency management.

---

## 8. Workflows and Diagrams

### 8.1 User Registration and Authentication Flow
┌─────────────┐
│  User lands │
│  on signup  │
└──────┬──────┘
│
▼
┌─────────────────┐
│ Submit signup   │
│ form with email,│
│ password, name  │
└──────┬──────────┘
│
▼
┌──────────────────────┐
│ Server validates     │
│ - Email format       │
│ - Password strength  │
│ - Duplicate check    │
└──────┬───────────────┘
│
▼
┌─────────────────────────┐
│ Create user record      │
│ - Hash password         │
│ - Generate verification │
│   token                 │
│ - emailVerified = false │
└──────┬──────────────────┘
│
▼
┌──────────────────────┐
│ Send verification    │
│ email with token link│
└──────┬───────────────┘
│
▼
┌─────────────────────┐
│ User clicks email   │
│ verification link   │
└──────┬──────────────┘
│
▼
┌──────────────────────┐
│ Server validates     │
│ token and marks      │
│ emailVerified = true │
└──────┬───────────────┘
│
▼
┌──────────────────┐
│ Redirect to login│
│ User can now     │
│ authenticate     │
└──────────────────┘

### 8.2 Event Lifecycle Workflow
┌──────────┐
│  DRAFT   │ ← Event created, not published
└─────┬────┘
│ Owner clicks "Publish"
▼
┌──────────────┐
│  PUBLISHED   │ ← Event visible, registrations open
│  (Upcoming)  │
└─────┬────────┘
│ Current time reaches event.startDatetime
▼
┌──────────────┐
│  PUBLISHED   │ ← Event in progress
│  (Ongoing)   │
└─────┬────────┘
│ Current time reaches event.endDatetime
▼
┌──────────────┐
│  COMPLETED   │ ← Event finished
│  (Past)      │
└─────┬────────┘
│ Owner enables showcase
▼
┌──────────────────┐
│  COMPLETED       │
│  + Showcase Link │
└──────────────────┘
Alternative flows:
DRAFT → DELETE (before publishing)
PUBLISHED → CANCELLED (owner cancels)
CANCELLED → Cannot transition to other states

### 8.3 Registration Flow - Automated Mode
┌────────────────┐
│ User clicks    │
│ "Register"     │
└───────┬────────┘
│
▼
┌───────────────────────┐
│ Check prerequisites:  │
│ - User authenticated  │
│ - Event not full      │
│ - Deadline not passed │
│ - Not already regist. │
└───────┬───────────────┘
│ All checks pass
▼
┌────────────────────────┐
│ Create registration    │
│ status: pending_email  │
└───────┬────────────────┘
│
▼
┌────────────────────────┐
│ Send confirmation email│
│ with verification link │
└───────┬────────────────┘
│
▼
┌────────────────────┐
│ User clicks email  │
│ confirmation link  │
└───────┬────────────┘
│
▼
┌─────────────────────────┐
│ Validate token          │
│ Update registration:    │
│ - status: confirmed     │
│ - emailConfirmedAt: now │
└───────┬─────────────────┘
│
▼
┌────────────────────────┐
│ Send acceptance email  │
│ with calendar invite   │
└───────┬────────────────┘
│
▼
┌────────────────────┐
│ Registration       │
│ complete!          │
│ User can attend    │
└────────────────────┘

### 8.4 Registration Flow - Manual Mode
┌────────────────┐
│ User clicks    │
│ "Register"     │
└───────┬────────┘
│
▼
┌───────────────────────┐
│ Create registration   │
│ status: pending_email │
└───────┬───────────────┘
│
▼
┌────────────────────────┐
│ Send confirmation email│
└───────┬────────────────┘
│
▼
┌────────────────────┐
│ User confirms email│
└───────┬────────────┘
│
▼
┌──────────────────────────┐
│ Update registration:     │
│ - status: pending_approval│
│ - emailConfirmedAt: now  │
└───────┬──────────────────┘
│
▼
┌───────────────────────────┐
│ Notify event owner        │
│ "New registration pending"│
└───────┬───────────────────┘
│
▼
┌─────────────────────┐
│ Owner reviews       │
│ registration        │
└─────┬───────┬───────┘
│       │
APPROVE   REJECT
│       │
▼       ▼
┌──────┐  ┌──────────┐
│Accept│  │ Reject   │
│email │  │ email    │
│+cal  │  │ +reason  │
└──────┘  └──────────┘

### 8.5 Database Entity Relationship Diagram
┌─────────────────────────────┐
│          USERS              │
├─────────────────────────────┤
│ PK  id (UUID)               │
│     email (unique)          │
│     password_hash           │
│     name                    │
│     profile_image_url       │
│     bio                     │
│     location                │
│     email_verified          │
│     created_at              │
└─────┬───────────────────────┘
│ 1
│ owns
│ M
▼
┌─────────────────────────────┐
│         EVENTS              │
├─────────────────────────────┤
│ PK  id (UUID)               │
│ FK  owner_id → Users.id     │
│     title                   │
│     description             │
│     banner_image_url        │
│     location_type           │
│     start_datetime          │
│     end_datetime            │
│     approval_mode           │
│     capacity_limit          │
│     status                  │
│     showcase_enabled        │
│     created_at              │
└─────┬───────────────────────┘
│ 1
│ has
│ M
▼
┌─────────────────────────────┐
│      REGISTRATIONS          │
├─────────────────────────────┤
│ PK  id (UUID)               │
│ FK  event_id → Events.id    │
│ FK  user_id → Users.id      │
│     registration_status     │
│     email_confirmed_at      │
│     email_confirmation_token│
│     approval_status         │
│     approved_at             │
│     registered_at           │
└─────┬───────────────────────┘
│ 1
│ generates
│ M
▼
┌─────────────────────────────┐
│      NOTIFICATIONS          │
├─────────────────────────────┤
│ PK  id (UUID)               │
│ FK  user_id → Users.id      │
│ FK  related_event_id        │
│ FK  related_registration_id │
│     type                    │
│     title                   │
│     message                 │
│     is_read                 │
│     created_at              │
└─────────────────────────────┘
┌─────────────────────────────┐
│      SHOWCASE_LINKS         │
├─────────────────────────────┤
│ PK  id (UUID)               │
│ FK  event_id → Events.id    │
│     slug (unique)           │
│     is_public               │
│     view_count              │
│     created_at              │
└─────────────────────────────┘
▲
│ 1:1
│
EVENTS

### 8.6 Email Notification Workflow
┌──────────────────────┐
│  Trigger Event       │
│  (Registration,      │
│   Approval, etc.)    │
└──────┬───────────────┘
│
▼
┌──────────────────────────┐
│ Create notification      │
│ record in database       │
└──────┬───────────────────┘
│
▼
┌──────────────────────────┐
│ Queue email job          │
│ (Resend/QStash)          │
└──────┬───────────────────┘
│
▼
┌──────────────────────────┐
│ Render email template    │
│ with personalized data   │
└──────┬───────────────────┘
│
▼
┌──────────────────────────┐
│ Attach calendar invite   │
│ (if applicable)          │
└──────┬───────────────────┘
│
▼
┌──────────────────────────┐
│ Send email via Resend    │
└──────┬───────────────────┘
│
▼
┌──────────────────────────┐
│ Update notification      │
│ delivery status          │
└──────────────────────────┘

---

## 9. Security Considerations

### 9.1 Authentication Security

**Password Security**:
- Minimum 8 characters with complexity requirements
- bcrypt hashing with salt rounds of 12
- Password strength meter on signup forms
- Secure password reset with time-limited tokens

**Session Management**:
- JWT tokens stored in HTTP-only cookies
- Token expiration: 7 days for standard sessions
- Refresh token rotation for extended sessions
- CSRF protection enabled

**Implementation Example**:
```typescript
import bcrypt from 'bcryptjs'

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
) {
  return bcrypt.compare(password, hashedPassword)
}
```

### 9.2 Email Verification

**Token Security**:
- Cryptographically secure random tokens (32 bytes)
- Time-limited validity (24 hours)
- Single-use tokens (invalidated after use)
- Rate limiting on verification attempts

**Implementation**:
```typescript
import crypto from 'crypto'

export function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex')
}

export function isTokenExpired(createdAt: Date) {
  const expiryTime = 24 * 60 * 60 * 1000 // 24 hours
  return Date.now() - createdAt.getTime() > expiryTime
}
```

### 9.3 API Security

**Request Validation**:
- Input sanitization using Zod schemas
- SQL injection prevention via Prisma parameterized queries
- XSS protection with content security policy

**Rate Limiting**:
```typescript
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
})

export async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier)
  return success
}
```

**Rate Limits**:
- Authentication endpoints: 5 attempts per 15 minutes
- Registration creation: 10 per hour per user
- Email sending: 20 per hour per user
- API requests: 100 per minute per IP

**Authorization Checks**:
```typescript
export async function verifyEventOwnership(
  eventId: string,
  userId: string
) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { ownerId: true }
  })
  
  if (!event || event.ownerId !== userId) {
    throw new Error("Unauthorized")
  }
}
```

### 9.4 Data Privacy

**Personal Data Protection**:
- GDPR compliance for EU users
- User data export functionality
- Account deletion with data anonymization
- Privacy policy and terms of service

**Data Exposure Prevention**:
- Private user data (email, phone) hidden from public APIs
- Event owner contact information protected
- Registration lists only visible to event owners

**Database Security**:
- Encrypted connections to Neon database
- Environment variables for sensitive credentials
- Regular backup schedules
- Row-level security policies

### 9.5 File Upload Security

**Cloudinary Security**:
- Signed upload requests
- File type validation (images only)
- Maximum file size limits (5MB)
- Automatic malware scanning
- Content moderation for inappropriate images

**Implementation**:
```typescript
export async function validateUpload(file: File) {
  // File type validation
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type")
  }
  
  // Size validation (5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("File too large")
  }
  
  return true
}
```

### 9.6 Protection Against Common Attacks

**SQL Injection**:
- Prisma ORM prevents SQL injection through parameterized queries
- Never construct raw SQL from user input

**Cross-Site Scripting (XSS)**:
- React's JSX automatically escapes content
- Content Security Policy headers configured
- Sanitize rich text editor content

**Cross-Site Request Forgery (CSRF)**:
- CSRF tokens for state-changing operations
- SameSite cookie attribute set to 'Lax'

**Clickjacking**:
- X-Frame-Options header set to 'DENY'
- Content-Security-Policy frame-ancestors directive

**Security Headers** (`next.config.js`):
```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]
```

---

## 10. Scalability and Performance

### 10.1 Database Optimization

**Indexing Strategy**:
- Primary keys automatically indexed
- Foreign keys indexed for join performance
- Composite indexes for common query patterns
- Full-text search indexes on event titles and descriptions

**Query Optimization**:
```typescript
// Efficient query with selective field retrieval
const events = await prisma.event.findMany({
  where: { status: 'published' },
  select: {
    id: true,
    title: true,
    startDatetime: true,
    bannerImageUrl: true,
    owner: {
      select: { name: true }
    },
    _count: {
      select: { registrations: true }
    }
  },
  take: 20,
  skip: page * 20
})
```

**Connection Pooling**:
- Neon provides automatic connection pooling
- Prisma manages connection lifecycle
- Serverless-optimized connection handling

### 10.2 Caching Strategy

**Static Content Caching**:
- Event pages cached with Incremental Static Regeneration
- Revalidation on event updates
- CDN caching for images and assets

**Redis Caching** (optional for high traffic):
```typescript
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export async function getEventWithCache(eventId: string) {
  // Check cache first
  const cached = await redis.get(`event:${eventId}`)
  if (cached) return cached
  
  // Fetch from database
  const event = await prisma.event.findUnique({
    where: { id: eventId }
  })
  
  // Cache for 5 minutes
  await redis.setex(`event:${eventId}`, 300, JSON.stringify(event))
  
  return event
}
```

**Cache Invalidation**:
- Event updates trigger cache purge
- Registration changes invalidate event cache
- Time-based expiration for analytics

### 10.3 Image Optimization

**Cloudinary Transformations**:
- Automatic format conversion (WebP)
- Responsive image sizes
- Lazy loading for below-fold images
- Quality optimization

**Next.js Image Component**:
```typescript
import Image from 'next/image'

<Image
  src={event.bannerImageUrl}
  alt={event.title}
  width={1200}
  height={675}
  priority={aboveFold}
  placeholder="blur"
/>
```

### 10.4 API Performance

**Pagination**:
- Cursor-based pagination for large datasets
- Default page size: 20 items
- Maximum page size: 100 items

**Response Compression**:
- Gzip compression enabled on Vercel
- JSON response optimization

**Database Query Batching**:
```typescript
// Batch load registrations for multiple events
const eventsWithCounts = await prisma.event.findMany({
  include: {
    _count: {
      select: { registrations: true }
    }
  }
})
```

### 10.5 Background Job Optimization

**Job Queuing**:
- Defer non-critical tasks to background jobs
- Email sending processed asynchronously
- Batch reminder emails for efficiency

**Scheduled Jobs**:
- Event status updates: Every 5 minutes
- Reminder emails: Cron-based scheduling
- Analytics aggregation: Daily

### 10.6 Frontend Performance

**Code Splitting**:
- Route-based code splitting with Next.js
- Dynamic imports for heavy components
- Lazy loading for modals and dropdowns

**Bundle Optimization**:
- Tree shaking for unused code removal
- Minification and compression
- Critical CSS inlining

**Performance Monitoring**:
- Web Vitals tracking
- Core Web Vitals optimization (LCP, FID, CLS)
- Vercel Analytics integration

### 10.7 Scalability Considerations

**Horizontal Scaling**:
- Serverless architecture scales automatically
- Stateless API design enables multiple instances
- Database connection pooling handles concurrent requests

**Capacity Planning**:
- Database size estimates based on user growth
- File storage monitoring with Cloudinary
- Email sending volume tracking

**Load Testing**:
- Simulate high registration volumes
- Test concurrent event creation
- Verify email delivery under load

---

## 11. Future Enhancements

### 11.1 Waitlist Management

**Feature Description**:
When events reach capacity, users can join a waitlist and be automatically notified if spots become available.

**Implementation**:
- Add `waitlist_enabled` field to Events table
- Create Waitlist table linked to Events and Users
- Automatic notification system for available slots
- Priority-based waitlist ordering

### 11.2 Event Ratings and Reviews

**Feature Description**:
Allow attendees to rate and review past events they attended.

**Implementation**:
- Reviews table with star ratings (1-5) and text feedback
- Display average rating on event cards
- Owner responses to reviews
- Moderation system for inappropriate reviews

### 11.3 Social Sharing

**Feature Description**:
One-click sharing of events to social media platforms.

**Implementation**:
- Open Graph meta tags for rich previews
- Share buttons for Facebook, Twitter, LinkedIn
- Custom share messages with event details
- Tracking of social referrals

### 11.4 Event Chat/Discussion

**Feature Description**:
Real-time chat for confirmed attendees before and during events.

**Implementation**:
- WebSocket-based chat using Pusher or Socket.io
- Event-specific chat rooms
- Moderator tools for event owners
- Chat history persistence

### 11.5 Recurring Events

**Feature Description**:
Create events that repeat on a schedule (daily, weekly, monthly).

**Implementation**:
- Recurrence rule definition
- Series management (edit single vs. all)
- Individual registration for each occurrence
- Bulk operations for series

### 11.6 Payment Integration

**Feature Description**:
Support for paid events with ticket purchases.

**Implementation**:
- Stripe integration for payment processing
- Ticket types with different pricing tiers
- Refund management
- Revenue tracking and payouts

### 11.7 Advanced Analytics

**Feature Description**:
Comprehensive analytics dashboard for event owners.

**Implementation**:
- Registration trends over time
- Demographic insights (with user consent)
- Conversion funnel analysis
- Export reports to CSV/PDF

### 11.8 Mobile Application

**Feature Description**:
Native mobile apps for iOS and Android.

**Implementation**:
- React Native for cross-platform development
- Push notifications for event reminders
- QR code check-in for event attendance
- Offline mode for viewing registered events

### 11.9 Event Discovery Algorithms

**Feature Description**:
Personalized event recommendations based on user interests and behavior.

**Implementation**:
- Machine learning recommendation engine
- User preference profiles
- Collaborative filtering
- "Recommended for you" section

### 11.10 Multi-language Support

**Feature Description**:
Internationalization for global audience reach.

**Implementation**:
- next-i18next for translation management
- Language selector in navigation
- Right-to-left (RTL) layout support
- Localized date/time formats

---

## Appendix A: Environment Variables Reference

Complete list of required environment variables:
```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME="Event Management Platform"

# Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET="generated-secret-key"

# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Cloud Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=1234567890
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=event-uploads

# Background Jobs (Upstash QStash)
QSTASH_URL=https://qstash.upstash.io
QSTASH_TOKEN=your-qstash-token
QSTASH_CURRENT_SIGNING_KEY=your-signing-key
QSTASH_NEXT_SIGNING_KEY=your-next-signing-key

# Redis (Optional - for caching)
UPSTASH_REDIS_REST_URL=https://your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Google Calendar API (Optional)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Rate Limiting
UPSTASH_RATELIMIT_REST_URL=https://your-redis-url
UPSTASH_RATELIMIT_REST_TOKEN=your-redis-token

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Appendix B: API Error Codes Reference

| Error Code | HTTP Status | Description | Common Causes |
|------------|-------------|-------------|---------------|
| VALIDATION_ERROR | 400 | Input validation failed | Invalid email format, weak password |
| UNAUTHORIZED | 401 | Authentication required | Missing or invalid token |
| FORBIDDEN | 403 | Insufficient permissions | Attempting to edit another user's event |
| NOT_FOUND | 404 | Resource not found | Invalid event ID or deleted resource |
| CONFLICT | 409 | Resource conflict | Duplicate registration, email already exists |
| CAPACITY_EXCEEDED | 400 | Event at full capacity | Attempting to register for full event |
| DEADLINE_PASSED | 400 | Registration deadline expired | Registering after deadline |
| INVALID_TOKEN | 400 | Token invalid or expired | Expired verification or reset token |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests | Exceeded API rate limits |
| INTERNAL_ERROR | 500 | Server error | Database connection failure, unexpected error |

---

## Appendix C: Database Migration Scripts

### Initial Schema Migration
```sql
-- Create UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE location_type AS ENUM ('physical', 'virtual');
CREATE TYPE approval_mode AS ENUM ('automated', 'manual');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE registration_status AS ENUM ('pending_email', 'pending_approval', 'confirmed', 'rejected', 'cancelled');
CREATE TYPE approval_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE notification_type AS ENUM (
  'new_registration',
  'registration_confirmed',
  'registration_accepted',
  'registration_rejected',
  'event_reminder',
  'event_updated',
  'event_cancelled',
  'system_announcement'
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  profile_image_url TEXT,
  bio TEXT,
  location VARCHAR(255),
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification_token ON users(verification_token);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  banner_image_url TEXT,
  category VARCHAR(100),
  tags TEXT[],
  location_type location_type NOT NULL,
  location_address TEXT,
  location_virtual_link TEXT,
  start_datetime TIMESTAMP NOT NULL,
  end_datetime TIMESTAMP NOT NULL,
  timezone VARCHAR(50) NOT NULL,
  approval_mode approval_mode NOT NULL,
  capacity_limit INTEGER,
  min_capacity INTEGER,
  registration_deadline TIMESTAMP,
  status event_status DEFAULT 'draft',
  showcase_enabled BOOLEAN DEFAULT FALSE,
  showcase_description TEXT,
  showcase_media_urls TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

CREATE INDEX idx_events_owner_id ON events(owner_id);
CREATE INDEX idx_events_start_datetime ON events(start_datetime);
CREATE INDEX idx_events_status ON events(status);

-- Registrations table
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  registration_status registration_status DEFAULT 'pending_email',
  email_confirmed_at TIMESTAMP,
  email_confirmation_token VARCHAR(255),
  approval_status approval_status,
  approved_at TIMESTAMP,
  approved_by_id UUID REFERENCES users(id),
  rejection_reason TEXT,
  cancelled_at TIMESTAMP,
  calendar_invite_sent BOOLEAN DEFAULT FALSE,
  reminder_sent_24h BOOLEAN DEFAULT FALSE,
  reminder_sent_1h BOOLEAN DEFAULT FALSE,
  registered_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

CREATE INDEX idx_registrations_event_id ON registrations(event_id);
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_status ON registrations(registration_status);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  related_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  related_registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- ShowcaseOKI want to use antigravity to build this application. Divide all these into tasks. So that antigravity can read the  task files and implement them.links table
CREATE TABLE showcase_links (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
event_id UUID UNIQUE NOT NULL REFERENCES events(id) ON DELETE CASCADE,
slug VARCHAR(255) UNIQUE NOT NULL,
is_public BOOLEAN DEFAULT TRUE,
view_count INTEGER DEFAULT 0,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_showcase_slug ON showcase_links(slug);

---

## Conclusion

This technical documentation provides a comprehensive blueprint for implementing a full-featured event management platform. The architecture leverages modern technologies including Next.js, Neon PostgreSQL, and Prisma to deliver a scalable, secure, and user-friendly application.

**Key Takeaways**:

1. **Flexible Registration System**: The dual-mode (automated/manual) approval system accommodates different event management styles

2. **Comprehensive User Experience**: From event discovery to post-event showcases, every aspect of the event lifecycle is carefully designed

3. **Scalable Architecture**: Serverless technologies and optimized database design ensure the platform can grow with user demand

4. **Security First**: Multiple layers of security protect user data and prevent common vulnerabilities

5. **Extensible Design**: The modular architecture supports future enhancements without major refactoring

**Development Roadmap**:

**Phase 1** (MVP - 8-10 weeks):
- User authentication and profiles
- Event creation and management
- Registration system (both modes)
- Email notifications
- Basic dashboard

**Phase 2** (4-6 weeks):
- Google Calendar integration
- Past event showcases
- Enhanced analytics
- Notification system
- UI polish

**Phase 3** (Ongoing):
- Performance optimization
- Mobile responsiveness refinement
- User feedback implementation
- Future enhancements from Appendix

This documentation should serve as the authoritative reference for all development, design, and stakeholder discussions throughout the project lifecycle.