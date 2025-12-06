import { unparse } from 'papaparse'

export interface AttendeeExportData {
  name: string
  email: string
  ticketNumber: string
  registrationStatus: string
  registeredAt: string
  checkedIn: boolean
  checkedInAt: string | null
}

/**
 * Generate CSV string from attendee data
 */
export function generateAttendeeCSV(attendees: AttendeeExportData[]): string {
  const csv = unparse(attendees, {
    columns: [
      'name',
      'email',
      'ticketNumber',
      'registrationStatus',
      'registeredAt',
      'checkedIn',
      'checkedInAt',
    ],
    header: true,
  })

  return csv
}

/**
 * Create downloadable CSV file response
 */
export function createCSVDownloadResponse(csv: string, filename: string) {
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}

/**
 * Format attendee data for export
 */
export function formatAttendeeForExport(attendee: any): AttendeeExportData {
  return {
    name: attendee.user.name,
    email: attendee.user.email,
    ticketNumber: attendee.ticketNumber,
    registrationStatus: attendee.registrationStatus,
    registeredAt: new Date(attendee.registeredAt).toLocaleString(),
    checkedIn: attendee.checkedInAt !== null,
    checkedInAt: attendee.checkedInAt 
      ? new Date(attendee.checkedInAt).toLocaleString()
      : 'Not checked in',
  }
}
