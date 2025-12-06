import { Event } from '@prisma/client'
import { format } from 'date-fns'

/**
 * Format event date and time for display in emails
 */
export function formatEventDateTime(event: Event) {
  const eventDate = new Date(event.startDatetime)
  
  return {
    date: format(eventDate, 'EEEE, MMMM d, yyyy'),
    time: format(eventDate, 'h:mm a') + (event.timezone ? ` (${event.timezone})` : ''),
    dateTime: format(eventDate, 'PPpp'),
  }
}

/**
 * Get formatted event location string
 */
export function getEventLocation(event: Event): string {
  if (event.locationType === 'virtual') {
    return event.locationVirtualLink || 'Virtual Event'
  }

  // Physical location
  const parts = [
    event.locationVenue,
    event.locationAddress,
    event.locationCity,
    event.locationState,
    event.locationCountry,
  ].filter(Boolean)

  return parts.join(', ') || 'Location TBA'
}

/**
 * Get event link for attendees
 */
export function getEventLink(eventId: string): string {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return `${baseUrl}/dashboard/events/${eventId}`
}

/**
 * Calculate time until event in hours
 */
export function getHoursUntilEvent(eventDate: Date): number {
  const now = new Date()
  const diffMs = eventDate.getTime() - now.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60))
}

/**
 * Check if event needs 24h reminder
 */
export function needsReminder24h(eventDate: Date): boolean {
  const hoursUntil = getHoursUntilEvent(eventDate)
  // Send reminder between 23 and 25 hours before event
  return hoursUntil >= 23 && hoursUntil <= 25
}

/**
 * Check if event needs 1h reminder
 */
export function needsReminder1h(eventDate: Date): boolean {
  const hoursUntil = getHoursUntilEvent(eventDate)
  // Send reminder between 50 minutes and 70 minutes before event
  const minutesUntil = (eventDate.getTime() - new Date().getTime()) / (1000 * 60)
  return minutesUntil >= 50 && minutesUntil <= 70
}
