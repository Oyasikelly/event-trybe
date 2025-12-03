import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email/send-email'
import { renderRegistrationApprovedEmail } from '@/lib/email/templates/registration-approved'
import { renderRegistrationRejectedEmail } from '@/lib/email/templates/registration-rejected'
import { formatEventDateRange } from '@/lib/utils/event-utils'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; registrationId: string }> }
) {
  try {
    const { id: eventId, registrationId } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify event ownership and get event details
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        ownerId: true,
        title: true,
        startDatetime: true,
        endDatetime: true,
        locationType: true,
        locationAddress: true,
        locationCity: true,
        locationState: true,
      },
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

    const body = await request.json()
    const { action } = body // 'approve' or 'reject'

    // Update registration
    const registration = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        registrationStatus: action === 'approve' ? 'confirmed' : 'cancelled',
        approvalStatus: action === 'approve' ? 'accepted' : 'rejected',
        approvedAt: action === 'approve' ? new Date() : null,
        approvedById: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Send email notification
    try {
      if (action === 'approve') {
        const eventLocation = event.locationType === 'virtual'
          ? 'Virtual Event'
          : event.locationCity && event.locationState
            ? `${event.locationCity}, ${event.locationState}`
            : event.locationAddress || 'TBA'

        const emailHtml = renderRegistrationApprovedEmail({
          userName: registration.user.name || 'there',
          eventTitle: event.title,
          eventDate: formatEventDateRange(
            new Date(event.startDatetime),
            new Date(event.endDatetime)
          ),
          eventLocation,
          eventUrl: `${process.env.NEXT_PUBLIC_APP_URL}/events/${eventId}`,
          ticketNumber: registration.ticketNumber,
          qrCodeUrl: registration.qrCode || undefined,
        })

        await sendEmail({
          to: registration.user.email!,
          subject: `Registration Approved: ${event.title}`,
          html: emailHtml,
        })
      } else {
        const emailHtml = renderRegistrationRejectedEmail({
          userName: registration.user.name || 'there',
          eventTitle: event.title,
        })

        await sendEmail({
          to: registration.user.email!,
          subject: `Registration Update: ${event.title}`,
          html: emailHtml,
        })
      }
    } catch (emailError) {
      console.error('Error sending notification email:', emailError)
      // Continue - email failure shouldn't fail the approval/rejection
    }

    return NextResponse.json({
      success: true,
      registration,
      message: `Registration ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
    })
  } catch (error) {
    console.error('Error updating registration:', error)
    return NextResponse.json(
      { error: 'Failed to update registration' },
      { status: 500 }
    )
  }
}
