import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Debug endpoint to check all events and their statuses
export async function GET(request: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const statusCount = events.reduce((acc, event) => {
      acc[event.status] = (acc[event.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      total: events.length,
      statusBreakdown: statusCount,
      events: events.map(e => ({
        id: e.id,
        title: e.title,
        status: e.status,
        createdAt: e.createdAt,
      })),
    })
  } catch (error) {
    console.error('Error fetching events debug info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
