import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verifyQRCodeData } from '@/lib/utils/qr-code'

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
    const { qrData } = await request.json()

    if (!qrData) {
      return NextResponse.json({ error: 'QR code data is required' }, { status: 400 })
    }

    // Verify the event exists and user is the owner
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (event.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Only event organizers can check-in attendees' }, { status: 403 })
    }

    // Verify and parse QR code data
    const qrCodeData = verifyQRCodeData(qrData)
    if (!qrCodeData) {
      return NextResponse.json({ error: 'Invalid QR code' }, { status: 400 })
    }

    // Verify QR code is for this event
    if (qrCodeData.eventId !== eventId) {
      return NextResponse.json({ error: 'QR code is not for this event' }, { status: 400 })
    }

    // Find the registration
    const registration = await prisma.registration.findUnique({
      where: { id: qrCodeData.registrationId },
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
    })

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    // Check if registration is confirmed
    if (registration.registrationStatus !== 'confirmed') {
      return NextResponse.json(
        { 
          error: 'Registration not confirmed',
          status: registration.registrationStatus 
        },
        { status: 400 }
      )
    }

    // Check if already checked in
    if (registration.checkedInAt) {
      return NextResponse.json(
        {
          error: 'Already checked in',
          checkedInAt: registration.checkedInAt,
          attendee: {
            name: registration.user.name,
            email: registration.user.email,
            ticketNumber: registration.ticketNumber,
          },
        },
        { status: 400 }
      )
    }

    // Update registration with check-in timestamp
    const updatedRegistration = await prisma.registration.update({
      where: { id: registration.id },
      data: {
        checkedInAt: new Date(),
      },
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
    })

    return NextResponse.json({
      success: true,
      message: 'Check-in successful',
      attendee: {
        name: updatedRegistration.user.name,
        email: updatedRegistration.user.email,
        ticketNumber: updatedRegistration.ticketNumber,
        profileImage: updatedRegistration.user.profileImageUrl,
        checkedInAt: updatedRegistration.checkedInAt,
      },
    })
  } catch (error) {
    console.error('Error checking in attendee:', error)
    return NextResponse.json(
      { error: 'Failed to check-in attendee' },
      { status: 500 }
    )
  }
}

// Get check-in statistics
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
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (event.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get check-in statistics
    const [totalRegistrations, checkedIn, notCheckedIn] = await Promise.all([
      prisma.registration.count({
        where: {
          eventId,
          registrationStatus: 'confirmed',
        },
      }),
      prisma.registration.count({
        where: {
          eventId,
          registrationStatus: 'confirmed',
          checkedInAt: { not: null },
        },
      }),
      prisma.registration.count({
        where: {
          eventId,
          registrationStatus: 'confirmed',
          checkedInAt: null,
        },
      }),
    ])

    // Get recent check-ins
    const recentCheckIns = await prisma.registration.findMany({
      where: {
        eventId,
        checkedInAt: { not: null },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            profileImageUrl: true,
          },
        },
      },
      orderBy: {
        checkedInAt: 'desc',
      },
      take: 10,
    })

    return NextResponse.json({
      statistics: {
        total: totalRegistrations,
        checkedIn,
        notCheckedIn,
        percentage: totalRegistrations > 0 ? Math.round((checkedIn / totalRegistrations) * 100) : 0,
      },
      recentCheckIns: recentCheckIns.map((reg) => ({
        id: reg.id,
        ticketNumber: reg.ticketNumber,
        name: reg.user.name,
        email: reg.user.email,
        profileImage: reg.user.profileImageUrl,
        checkedInAt: reg.checkedInAt,
      })),
    })
  } catch (error) {
    console.error('Error fetching check-in stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch check-in statistics' },
      { status: 500 }
    )
  }
}
