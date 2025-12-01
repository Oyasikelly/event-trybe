import { z } from 'zod'

// Event Categories
export const eventCategories = [
  'CONFERENCE',
  'WORKSHOP',
  'SEMINAR',
  'MEETUP',
  'WEBINAR',
  'NETWORKING',
  'SOCIAL',
  'SPORTS',
  'MUSIC',
  'ART',
  'TECH',
  'BUSINESS',
  'EDUCATION',
  'OTHER',
] as const

export const eventTypes = ['IN_PERSON', 'VIRTUAL', 'HYBRID'] as const

export const eventStatuses = ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'] as const

// Event Creation Schema
export const eventSchema = z.object({
  // Basic Information
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.enum(eventCategories).refine((val) => eventCategories.includes(val), {
    message: 'Please select a valid category',
  }),
  eventType: z.enum(eventTypes).refine((val) => eventTypes.includes(val), {
    message: 'Please select an event type',
  }),
  
  // Date & Time
  startDatetime: z.string().or(z.date()),
  endDatetime: z.string().or(z.date()),
  timezone: z.string().min(1, 'Please select a timezone'),
  
  // Location
  locationType: z.enum(['physical', 'virtual']),
  locationVenue: z.string().optional(),
  locationAddress: z.string().optional(),
  locationCity: z.string().optional(),
  locationState: z.string().optional(),
  locationCountry: z.string().optional(),
  locationVirtualLink: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  
  // Registration Settings
  capacityLimit: z.number().int().positive().optional().or(z.literal(null)),
  registrationDeadline: z.string().or(z.date()).optional().or(z.literal(null)),
  approvalMode: z.enum(['automated', 'manual']),
  
  // Pricing
  isFree: z.boolean().default(true),
  price: z.number().positive().optional().or(z.literal(null)),
  currency: z.string().default('USD'),
  
  // Additional Details
  tags: z.array(z.string()).default([]),
  requirements: z.string().optional(),
  bannerImageUrl: z.string().url().optional().or(z.literal('')),
  liveEventUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  
  // Status
  status: z.enum(['draft', 'published']).default('draft'),
}).refine(
  (data) => {
    // Validate end date is after start date
    const start = new Date(data.startDatetime)
    const end = new Date(data.endDatetime)
    return end > start
  },
  {
    message: 'End date must be after start date',
    path: ['endDatetime'],
  }
).refine(
  (data) => {
    // If physical event, require address
    if (data.locationType === 'physical' && data.eventType !== 'VIRTUAL') {
      return !!data.locationAddress || !!data.locationVenue
    }
    return true
  },
  {
    message: 'Physical events require a venue or address',
    path: ['locationAddress'],
  }
).refine(
  (data) => {
    // If virtual event, require link
    if (data.locationType === 'virtual' || data.eventType === 'VIRTUAL') {
      return !!data.locationVirtualLink
    }
    return true
  },
  {
    message: 'Virtual events require a meeting link',
    path: ['locationVirtualLink'],
  }
).refine(
  (data) => {
    // If not free, require price
    if (!data.isFree) {
      return !!data.price && data.price > 0
    }
    return true
  },
  {
    message: 'Paid events require a price',
    path: ['price'],
  }
)

export type EventInput = z.infer<typeof eventSchema>

// Event Update Schema (allows partial updates)
export const eventUpdateSchema = eventSchema.partial()

export type EventUpdateInput = z.infer<typeof eventUpdateSchema>

// Registration Schema
export const registrationSchema = z.object({
  eventId: z.string().uuid('Invalid event ID'),
  additionalInfo: z.string().optional(),
})

export type RegistrationInput = z.infer<typeof registrationSchema>

// Event Filter Schema (for browsing/searching)
export const eventFilterSchema = z.object({
  search: z.string().optional(),
  category: z.enum(eventCategories).optional(),
  eventType: z.enum(eventTypes).optional(),
  status: z.enum(eventStatuses).optional(),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
  isFree: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(12),
})

export type EventFilterInput = z.infer<typeof eventFilterSchema>
