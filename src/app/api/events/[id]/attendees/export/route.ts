import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { 
  generateAttendeeCSV, 
  formatAttendeeForExport,
  createCSVDownloadResponse 
} from '@/lib/utils/export-csv'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: eventId } = await params

    // Verify event ownership
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { ownerId: true, title: true },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (event.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const checkedIn = searchParams.get('checkedIn')

    // Build filter conditions
    const whereConditions: any = {
      eventId,
    }

    if (status && status !== 'all') {
      whereConditions.registrationStatus = status
    }

    if (checkedIn === 'true') {
      whereConditions.checkedInAt = { not: null }
    } else if (checkedIn === 'false') {
      whereConditions.checkedInAt = null
    }

    // Fetch attendees
    const attendees = await prisma.registration.findMany({
      where: whereConditions,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        registeredAt: 'desc',
      },
    })

    // Format data for export
    const exportData = attendees.map(formatAttendeeForExport)

    // Generate CSV
    const csv = generateAttendeeCSV(exportData)

    // Create filename with event title and date
    const date = new Date().toISOString().split('T')[0]
    const sanitizedTitle = event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    const filename = `${sanitizedTitle}_attendees_${date}.csv`

    // Return CSV file
    return createCSVDownloadResponse(csv, filename)
  } catch (error) {
    console.error('Error exporting attendees:', error)
    return NextResponse.json(
      { error: 'Failed to export attendees' },
      { status: 500 }
    )
  }
}
