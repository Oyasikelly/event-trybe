import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      where: {
        status: 'published',
        // Show all published events (past and future)
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        category: true,
        eventType: true,
        startDatetime: true,
        endDatetime: true,
        locationType: true,
        locationCity: true,
        locationState: true,
        isFree: true,
        price: true,
        currency: true,
        capacityLimit: true,
        bannerImageUrl: true,
        tags: true,
        ownerId: true, // Include ownerId for identifying user's own events
        owner: {
          select: {
            name: true,
            profileImageUrl: true,
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
      orderBy: [
        { createdAt: 'desc' }, // Latest events first
        { startDatetime: 'asc' }, // Then by start date
      ],
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching public events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
