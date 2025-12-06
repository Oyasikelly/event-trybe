import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: eventId } = await params

    // Get the original event
    const originalEvent = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!originalEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check if user owns the event
    if (originalEvent.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Create a duplicate with a new slug
    const timestamp = Date.now()
    const duplicatedEvent = await prisma.event.create({
      data: {
        title: `${originalEvent.title} (Copy)`,
        slug: `${originalEvent.slug}-copy-${timestamp}`,
        description: originalEvent.description,
        category: originalEvent.category,
        status: 'draft', // Always create as draft
        eventType: originalEvent.eventType,
        
        // Date & Time
        startDatetime: originalEvent.startDatetime,
        endDatetime: originalEvent.endDatetime,
        timezone: originalEvent.timezone,
        
        // Location
        locationType: originalEvent.locationType,
        locationVenue: originalEvent.locationVenue,
        locationAddress: originalEvent.locationAddress,
        locationCity: originalEvent.locationCity,
        locationState: originalEvent.locationState,
        locationCountry: originalEvent.locationCountry,
        locationVirtualLink: originalEvent.locationVirtualLink,
        liveEventUrl: originalEvent.liveEventUrl,
        
        // Registration
        capacityLimit: originalEvent.capacityLimit,
        registrationDeadline: originalEvent.registrationDeadline,
        approvalMode: originalEvent.approvalMode,
        isFree: originalEvent.isFree,
        price: originalEvent.price,
        currency: originalEvent.currency,
        
        // Media
        bannerImageUrl: originalEvent.bannerImageUrl,
        
        // Additional
        tags: originalEvent.tags,
        requirements: originalEvent.requirements,
        
        // Owner
        ownerId: session.user.id,
      },
    })

    return NextResponse.json(duplicatedEvent)
  } catch (error) {
    console.error('Error duplicating event:', error)
    return NextResponse.json(
      { error: 'Failed to duplicate event' },
      { status: 500 }
    )
  }
}
