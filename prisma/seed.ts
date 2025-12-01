import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Helper function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function main() {
  console.log('🌱 Starting database seed...\n')

  // Clear existing data
  console.log('🧹 Cleaning existing data...')
  await prisma.notification.deleteMany()
  await prisma.showcaseLink.deleteMany()
  await prisma.registration.deleteMany()
  await prisma.event.deleteMany()
  await prisma.user.deleteMany()
  console.log('✅ Existing data cleared\n')

  // Create Users
  console.log('👤 Creating users...')
  const hashedPassword = await bcrypt.hash('password123', 10)

  const user1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      passwordHash: hashedPassword,
      name: 'John Doe',
      bio: 'Tech enthusiast and event organizer. Love bringing people together!',
      location: 'San Francisco, CA',
      emailVerified: true,
      isActive: true,
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      passwordHash: hashedPassword,
      name: 'Jane Smith',
      bio: 'Community builder and developer advocate. Passionate about education.',
      location: 'New York, NY',
      emailVerified: true,
      isActive: true,
    },
  })

  console.log(`✅ Created users: ${user1.name}, ${user2.name}\n`)

  // Create Events
  console.log('📅 Creating events...')

  // Event 1: Upcoming Tech Conference (John's event)
  const event1 = await prisma.event.create({
    data: {
      ownerId: user1.id,
      title: 'Tech Innovation Summit 2025',
      slug: generateSlug('Tech Innovation Summit 2025'),
      description: `Join us for the biggest tech conference of the year! 
      
      This summit brings together industry leaders, innovators, and tech enthusiasts for three days of inspiring talks, hands-on workshops, and networking opportunities.
      
      **What to expect:**
      - Keynote speeches from tech giants
      - Interactive workshops on AI, Web3, and Cloud Computing
      - Networking sessions with industry professionals
      - Startup pitch competition
      
      Don't miss this opportunity to learn, connect, and grow!`,
      category: 'TECH',
      tags: ['tech', 'conference', 'networking', 'innovation'],
      locationType: 'physical',
      locationAddress: 'Moscone Center, 747 Howard St, San Francisco, CA 94103',
      startDatetime: new Date('2025-03-15T09:00:00Z'),
      endDatetime: new Date('2025-03-17T18:00:00Z'),
      timezone: 'America/Los_Angeles',
      approvalMode: 'automated',
      capacityLimit: 500,
      minCapacity: 50,
      registrationDeadline: new Date('2025-03-10T23:59:59Z'),
      status: 'published',
      publishedAt: new Date(),
    },
  })

  // Event 2: Virtual Workshop (Jane's event)
  const event2 = await prisma.event.create({
    data: {
      ownerId: user2.id,
      title: 'React Masterclass: Building Modern Web Apps',
      slug: generateSlug('React Masterclass: Building Modern Web Apps'),
      description: `Level up your React skills in this intensive 4-hour workshop!
      
      **What you'll learn:**
      - React 19 new features and best practices
      - Server Components and App Router
      - State management with Zustand
      - Performance optimization techniques
      - Testing with Vitest and React Testing Library
      
      **Prerequisites:**
      - Basic JavaScript knowledge
      - Familiarity with React fundamentals
      
      All attendees will receive course materials and access to recordings.`,
      category: 'EDUCATION',
      tags: ['react', 'javascript', 'web development', 'workshop'],
      locationType: 'virtual',
      locationVirtualLink: 'https://zoom.us/j/123456789',
      startDatetime: new Date('2025-02-20T14:00:00Z'),
      endDatetime: new Date('2025-02-20T18:00:00Z'),
      timezone: 'America/New_York',
      approvalMode: 'manual',
      capacityLimit: 100,
      registrationDeadline: new Date('2025-02-18T23:59:59Z'),
      status: 'published',
      publishedAt: new Date(),
    },
  })

  // Event 3: Ongoing Meetup (John's event)
  const event3 = await prisma.event.create({
    data: {
      ownerId: user1.id,
      title: 'Weekly Developer Meetup',
      slug: generateSlug('Weekly Developer Meetup'),
      description: `Join our weekly casual meetup for developers!
      
      A relaxed environment to:
      - Share what you're working on
      - Get help with coding challenges
      - Network with fellow developers
      - Discuss latest tech trends
      
      All skill levels welcome!`,
      category: 'NETWORKING',
      tags: ['developers', 'meetup', 'networking', 'community'],
      locationType: 'physical',
      locationAddress: 'Tech Hub Coworking, 123 Market St, San Francisco, CA',
      startDatetime: new Date(Date.now() - 2 * 60 * 60 * 1000), // Started 2 hours ago
      endDatetime: new Date(Date.now() + 2 * 60 * 60 * 1000), // Ends in 2 hours
      timezone: 'America/Los_Angeles',
      approvalMode: 'automated',
      capacityLimit: 30,
      status: 'published',
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Published 7 days ago
    },
  })

  // Event 4: Past Event with Showcase (Jane's event)
  const event4 = await prisma.event.create({
    data: {
      ownerId: user2.id,
      title: 'Web Development Bootcamp 2024',
      slug: generateSlug('Web Development Bootcamp 2024'),
      description: `An intensive 12-week bootcamp that transformed beginners into full-stack developers.
      
      **Highlights:**
      - 50+ students graduated
      - 85% job placement rate
      - Built 100+ real-world projects
      - Guest lectures from industry experts`,
      category: 'EDUCATION',
      tags: ['bootcamp', 'web development', 'career', 'education'],
      locationType: 'physical',
      locationAddress: 'Code Academy, 456 Broadway, New York, NY',
      startDatetime: new Date('2024-09-01T09:00:00Z'),
      endDatetime: new Date('2024-11-30T17:00:00Z'),
      timezone: 'America/New_York',
      approvalMode: 'manual',
      capacityLimit: 50,
      status: 'completed',
      showcaseEnabled: true,
      showcaseDescription: 'An amazing journey of learning and growth. See photos from our graduation ceremony and final project presentations!',
      showcaseMediaUrls: [
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
        'https://images.unsplash.com/photo-1523580494863-6f3031224c94',
      ],
      publishedAt: new Date('2024-08-15T00:00:00Z'),
    },
  })

  // Event 5: Draft Event (John's event)
  const event5 = await prisma.event.create({
    data: {
      ownerId: user1.id,
      title: 'AI & Machine Learning Conference',
      slug: generateSlug('AI & Machine Learning Conference'),
      description: 'Coming soon! Details to be announced.',
      category: 'TECH',
      tags: ['AI', 'machine learning', 'conference'],
      locationType: 'virtual',
      locationVirtualLink: 'TBD',
      startDatetime: new Date('2025-06-01T10:00:00Z'),
      endDatetime: new Date('2025-06-03T18:00:00Z'),
      timezone: 'America/Los_Angeles',
      approvalMode: 'automated',
      status: 'draft',
    },
  })

  console.log(`✅ Created ${5} events\n`)

  // Create Registrations
  console.log('📝 Creating registrations...')

  // User 2 registers for User 1's Tech Summit (automated, confirmed)
  const reg1 = await prisma.registration.create({
    data: {
      eventId: event1.id,
      userId: user2.id,
      ticketNumber: 'TKT-001',
      registrationStatus: 'confirmed',
      emailConfirmedAt: new Date(),
      calendarInviteSent: true,
    },
  })

  // User 1 registers for User 2's React Workshop (manual, pending approval)
  const reg2 = await prisma.registration.create({
    data: {
      eventId: event2.id,
      userId: user1.id,
      ticketNumber: 'TKT-002',
      registrationStatus: 'pending_approval',
      emailConfirmedAt: new Date(),
      approvalStatus: 'pending',
    },
  })

  // User 2 registers for User 1's Meetup (automated, confirmed)
  const reg3 = await prisma.registration.create({
    data: {
      eventId: event3.id,
      userId: user2.id,
      ticketNumber: 'TKT-003',
      registrationStatus: 'confirmed',
      emailConfirmedAt: new Date(),
      calendarInviteSent: true,
      reminderSent24h: true,
    },
  })

  // User 1 registered for past bootcamp (completed)
  const reg4 = await prisma.registration.create({
    data: {
      eventId: event4.id,
      userId: user1.id,
      ticketNumber: 'TKT-004',
      registrationStatus: 'confirmed',
      emailConfirmedAt: new Date('2024-08-20T00:00:00Z'),
      approvalStatus: 'accepted',
      approvedAt: new Date('2024-08-21T00:00:00Z'),
      approvedById: user2.id,
      calendarInviteSent: true,
      reminderSent24h: true,
      reminderSent1h: true,
    },
  })

  console.log(`✅ Created ${4} registrations\n`)

  // Create Notifications
  console.log('🔔 Creating notifications...')

  await prisma.notification.create({
    data: {
      userId: user1.id,
      type: 'new_registration',
      title: 'New Registration',
      message: `${user2.name} registered for ${event1.title}`,
      link: `/events/${event1.id}/manage`,
      relatedEventId: event1.id,
      relatedRegistrationId: reg1.id,
      isRead: false,
    },
  })

  await prisma.notification.create({
    data: {
      userId: user2.id,
      type: 'registration_confirmed',
      title: 'Registration Confirmed',
      message: `Your registration for ${event1.title} has been confirmed!`,
      link: `/events/${event1.id}`,
      relatedEventId: event1.id,
      relatedRegistrationId: reg1.id,
      isRead: true,
      readAt: new Date(),
    },
  })

  await prisma.notification.create({
    data: {
      userId: user1.id,
      type: 'event_reminder',
      title: 'Event Starting Soon',
      message: `${event3.title} starts in 1 hour!`,
      link: `/events/${event3.id}`,
      relatedEventId: event3.id,
      isRead: false,
    },
  })

  await prisma.notification.create({
    data: {
      userId: user2.id,
      type: 'new_registration',
      title: 'New Registration Pending',
      message: `${user1.name} registered for ${event2.title} and is awaiting approval`,
      link: `/events/${event2.id}/manage`,
      relatedEventId: event2.id,
      relatedRegistrationId: reg2.id,
      isRead: false,
    },
  })

  console.log(`✅ Created ${4} notifications\n`)

  // Create Showcase Link
  console.log('🎨 Creating showcase link...')

  await prisma.showcaseLink.create({
    data: {
      eventId: event4.id,
      slug: 'web-development-bootcamp-2024',
      isPublic: true,
      viewCount: 127,
    },
  })

  console.log(`✅ Created showcase link\n`)

  // Summary
  console.log('📊 Seed Summary:')
  console.log('================')
  console.log(`👤 Users: 2`)
  console.log(`📅 Events: 5 (1 draft, 2 published upcoming, 1 ongoing, 1 completed)`)
  console.log(`📝 Registrations: 4`)
  console.log(`🔔 Notifications: 4`)
  console.log(`🎨 Showcase Links: 1`)
  console.log('\n✅ Database seeded successfully!')
  console.log('\n📝 Test Credentials:')
  console.log('   Email: john.doe@example.com')
  console.log('   Email: jane.smith@example.com')
  console.log('   Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
