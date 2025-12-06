/**
 * Calendar Integration Utilities
 * Generates ICS files and calendar URLs for Google Calendar, Outlook, and Apple Calendar
 */

interface EventDetails {
  title: string
  description: string
  location: string
  startDatetime: Date
  endDatetime: Date
  organizerEmail?: string
  organizerName?: string
}

/**
 * Format date to ICS format (YYYYMMDDTHHMMSSZ)
 */
function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

/**
 * Escape special characters for ICS format
 */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

/**
 * Generate ICS (iCalendar) file content
 */
export function generateICSFile(event: EventDetails): string {
  const now = new Date()
  const startDate = formatICSDate(event.startDatetime)
  const endDate = formatICSDate(event.endDatetime)
  const timestamp = formatICSDate(now)
  
  // Generate unique UID for the event
  const uid = `${timestamp}-${Math.random().toString(36).substring(7)}@eventtrybe.com`

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EventTrybe//Event Management//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `SUMMARY:${escapeICSText(event.title)}`,
    `DESCRIPTION:${escapeICSText(event.description)}`,
    `LOCATION:${escapeICSText(event.location)}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
  ]

  // Add organizer if provided
  if (event.organizerEmail && event.organizerName) {
    icsContent.push(
      `ORGANIZER;CN=${escapeICSText(event.organizerName)}:MAILTO:${event.organizerEmail}`
    )
  }

  icsContent.push(
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${escapeICSText(event.title)} starts in 24 hours`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  )

  return icsContent.join('\r\n')
}

/**
 * Generate Google Calendar URL
 */
export function generateGoogleCalendarUrl(event: EventDetails): string {
  const startDate = formatICSDate(event.startDatetime)
  const endDate = formatICSDate(event.endDatetime)

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${startDate}/${endDate}`,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/**
 * Generate Outlook Calendar URL
 */
export function generateOutlookCalendarUrl(event: EventDetails): string {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    body: event.description,
    location: event.location,
    startdt: event.startDatetime.toISOString(),
    enddt: event.endDatetime.toISOString(),
  })

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}

/**
 * Generate Office 365 Calendar URL
 */
export function generateOffice365CalendarUrl(event: EventDetails): string {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    body: event.description,
    location: event.location,
    startdt: event.startDatetime.toISOString(),
    enddt: event.endDatetime.toISOString(),
  })

  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`
}

/**
 * Generate Yahoo Calendar URL
 */
export function generateYahooCalendarUrl(event: EventDetails): string {
  const startDate = formatICSDate(event.startDatetime)
  const endDate = formatICSDate(event.endDatetime)

  const params = new URLSearchParams({
    v: '60',
    title: event.title,
    desc: event.description,
    in_loc: event.location,
    st: startDate,
    et: endDate,
  })

  return `https://calendar.yahoo.com/?${params.toString()}`
}

/**
 * Generate data URL for ICS file download
 */
export function generateICSDataUrl(icsContent: string): string {
  const blob = Buffer.from(icsContent, 'utf-8').toString('base64')
  return `data:text/calendar;charset=utf-8;base64,${blob}`
}
