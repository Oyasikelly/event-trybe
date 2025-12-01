import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      where: {
        status: 'published',
        // Show all published events (past and future)
      },
      include: {
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
      orderBy: {
        startDatetime: 'asc',
      },
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
