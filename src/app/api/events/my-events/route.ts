import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/events/my-events - Get user's events
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {
      ownerId: session.user.id,
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        _count: {
          select: {
            registrations: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Calculate stats for each event
    const eventsWithStats = events.map((event) => ({
      ...event,
      stats: {
        views: event.viewCount,
        registrations: event._count.registrations,
        capacity: event.capacityLimit,
        revenue: event.isFree ? 0 : (event._count.registrations * Number(event.price || 0)),
      },
    }))

    return NextResponse.json(eventsWithStats)
  } catch (error) {
    console.error('Error fetching user events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
