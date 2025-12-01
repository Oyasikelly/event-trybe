/**
 * Event Utilities
 * Helper functions for event management
 */

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by appending a random string
 */
export function generateUniqueSlug(title: string): string {
  const baseSlug = generateSlug(title)
  const randomString = Math.random().toString(36).substring(2, 8)
  return `${baseSlug}-${randomString}`
}

/**
 * Generate a unique ticket number
 */
export function generateTicketNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `TKT-${timestamp}-${random}`
}

/**
 * Format event date range
 */
export function formatEventDateRange(startDate: Date, endDate: Date): string {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  const sameDay = start.toDateString() === end.toDateString()
  
  if (sameDay) {
    return `${start.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })} • ${start.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })} - ${end.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })}`
  }
  
  return `${start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} - ${end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`
}

/**
 * Calculate event duration in hours
 */
export function calculateDuration(startDate: Date, endDate: Date): number {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  return (end - start) / (1000 * 60 * 60) // Convert to hours
}

/**
 * Check if event registration is open
 */
export function isRegistrationOpen(event: {
  registrationDeadline?: Date | null
  startDatetime: Date
  status: string
  capacityLimit?: number | null
  _count?: { registrations: number }
}): boolean {
  // Check if event is published
  if (event.status !== 'published') return false
  
  // Check if event has already started
  if (new Date(event.startDatetime) < new Date()) return false
  
  // Check registration deadline
  if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date()) {
    return false
  }
  
  // Check capacity
  if (event.capacityLimit && event._count) {
    if (event._count.registrations >= event.capacityLimit) return false
  }
  
  return true
}

/**
 * Get event status badge color
 */
export function getEventStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'published':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'draft':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'completed':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

/**
 * Format price
 */
export function formatPrice(price: number | null, currency: string = 'USD'): string {
  if (!price) return 'Free'
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(Number(price))
}

/**
 * Get category icon (emoji)
 */
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    CONFERENCE: '🎤',
    WORKSHOP: '🛠️',
    SEMINAR: '📚',
    MEETUP: '🤝',
    WEBINAR: '💻',
    NETWORKING: '🌐',
    SOCIAL: '🎉',
    SPORTS: '⚽',
    MUSIC: '🎵',
    ART: '🎨',
    TECH: '💡',
    BUSINESS: '💼',
    EDUCATION: '🎓',
    OTHER: '📌',
  }
  
  return icons[category] || '📌'
}
