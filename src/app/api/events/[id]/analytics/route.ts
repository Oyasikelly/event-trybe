import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify event ownership
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { ownerId: true },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    if (event.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden - You do not own this event' },
        { status: 403 }
      )
    }

    // Fetch analytics data
    const [
      totalRegistrations,
      confirmedRegistrations,
      pendingRegistrations,
      cancelledRegistrations,
      eventDetails,
      registrationsByDay,
    ] = await Promise.all([
      // Total registrations
      prisma.registration.count({
        where: { eventId },
      }),
      // Confirmed registrations
      prisma.registration.count({
        where: {
          eventId,
          registrationStatus: 'confirmed',
        },
      }),
      // Pending approval
      prisma.registration.count({
        where: {
          eventId,
          registrationStatus: 'pending_approval',
        },
      }),
      // Cancelled
      prisma.registration.count({
        where: {
          eventId,
          registrationStatus: 'cancelled',
        },
      }),
      // Event details for capacity
      prisma.event.findUnique({
        where: { id: eventId },
        select: {
          capacityLimit: true,
          isFree: true,
          price: true,
          currency: true,
        },
      }),
      // Registrations by day (last 30 days)
      prisma.$queryRaw`
        SELECT 
          DATE(registered_at) as date,
          COUNT(*) as count
        FROM registrations
        WHERE event_id = ${eventId}
          AND registered_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(registered_at)
        ORDER BY date ASC
      `,
    ])

    // Calculate capacity usage
    const capacityUsed = eventDetails?.capacityLimit
      ? (totalRegistrations / eventDetails.capacityLimit) * 100
      : null

    // Calculate revenue (if paid event)
    const revenue = !eventDetails?.isFree && eventDetails?.price
      ? confirmedRegistrations * Number(eventDetails.price)
      : 0

    // Convert BigInt to number in registrationsByDay
    const formattedRegistrationsByDay = (registrationsByDay as any[]).map((row: any) => ({
      date: row.date,
      count: Number(row.count), // Convert BigInt to number
    }))

    const analytics = {
      totalRegistrations,
      confirmedRegistrations,
      pendingRegistrations,
      cancelledRegistrations,
      capacityLimit: eventDetails?.capacityLimit || null,
      capacityUsed: capacityUsed ? Math.round(capacityUsed) : null,
      revenue,
      currency: eventDetails?.currency || 'USD',
      registrationsByDay: formattedRegistrationsByDay,
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching event analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
