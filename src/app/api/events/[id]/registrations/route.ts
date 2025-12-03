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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status') || 'all'
    const searchQuery = searchParams.get('search') || ''

    // Build where clause
    const where: any = {
      eventId,
    }

    if (statusFilter !== 'all') {
      where.registrationStatus = statusFilter
    }

    if (searchQuery) {
      where.user = {
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { email: { contains: searchQuery, mode: 'insensitive' } },
        ],
      }
    }

    // Fetch registrations
    const registrations = await prisma.registration.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          },
        },
      },
      orderBy: {
        registeredAt: 'desc',
      },
    })

    // Get stats
    const stats = {
      total: await prisma.registration.count({ where: { eventId } }),
      confirmed: await prisma.registration.count({
        where: { eventId, registrationStatus: 'confirmed' },
      }),
      pending: await prisma.registration.count({
        where: { eventId, registrationStatus: 'pending_approval' },
      }),
      cancelled: await prisma.registration.count({
        where: { eventId, registrationStatus: 'cancelled' },
      }),
    }

    return NextResponse.json({
      registrations,
      stats,
    })
  } catch (error) {
    console.error('Error fetching registrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}
