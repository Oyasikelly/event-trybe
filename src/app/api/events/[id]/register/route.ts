import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to register' },
        { status: 401 }
      )
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        title: true,
        status: true,
        capacityLimit: true,
        registrationDeadline: true,
        startDatetime: true,
        approvalMode: true,
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Check if event is published
    if (event.status !== 'published') {
      return NextResponse.json(
        { error: 'This event is not available for registration' },
        { status: 400 }
      )
    }

    // Check if registration deadline has passed
    if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date()) {
      return NextResponse.json(
        { error: 'Registration deadline has passed' },
        { status: 400 }
      )
    }

    // Check if event has already started
    if (new Date(event.startDatetime) < new Date()) {
      return NextResponse.json(
        { error: 'This event has already started' },
        { status: 400 }
      )
    }

    // Check if event is full
    if (event.capacityLimit && event._count.registrations >= event.capacityLimit) {
      return NextResponse.json(
        { error: 'This event is full' },
        { status: 400 }
      )
    }

    // Check if user is already registered
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        eventId,
        userId: session.user.id,
      },
    })

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'You are already registered for this event' },
        { status: 400 }
      )
    }

    // Generate unique ticket number
    const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    // Create registration
    const registration = await prisma.registration.create({
      data: {
        eventId,
        userId: session.user.id,
        ticketNumber,
        registrationStatus: event.approvalMode === 'automated' ? 'confirmed' : 'pending_approval',
        approvalStatus: event.approvalMode === 'automated' ? 'accepted' : 'pending',
        emailConfirmedAt: new Date(),
      },
      include: {
        event: {
          select: {
            title: true,
            startDatetime: true,
            endDatetime: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      registration,
      message: event.approvalMode === 'automated' 
        ? 'Successfully registered for the event!' 
        : 'Registration submitted and pending approval',
    })
  } catch (error) {
    console.error('Error registering for event:', error)
    return NextResponse.json(
      { error: 'Failed to register for event' },
      { status: 500 }
    )
  }
}
