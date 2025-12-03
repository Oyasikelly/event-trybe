import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateTicketNumber } from '@/lib/utils/ticket-code'
import { generateQRCodeBuffer } from '@/lib/utils/qr-code'
import { uploadQRCodeToCloudinary } from '@/lib/utils/upload-qr-cloudinary'
import { sendEmail } from '@/lib/email/send-email'
import { renderRegistrationConfirmationEmail } from '@/lib/email/templates/registration-confirmation'
import { formatEventDateRange } from '@/lib/utils/event-utils'

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
        endDatetime: true,
        approvalMode: true,
        locationType: true,
        locationAddress: true,
        locationCity: true,
        locationState: true,
        liveEventUrl: true,
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
    const ticketNumber = generateTicketNumber()

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
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Generate QR code and upload to Cloudinary
    let qrCodeUrl: string | undefined

    try {
      const qrCodeData = {
        ticketNumber: registration.ticketNumber,
        eventId: registration.eventId,
        userId: registration.userId,
        registrationId: registration.id,
        timestamp: new Date().toISOString(),
      }

      const qrCodeBuffer = await generateQRCodeBuffer(qrCodeData)
      qrCodeUrl = await uploadQRCodeToCloudinary(qrCodeBuffer, registration.ticketNumber)

      // Update registration with QR code URL
      await prisma.registration.update({
        where: { id: registration.id },
        data: { qrCode: qrCodeUrl },
      })
    } catch (qrError) {
      console.error('Error generating/uploading QR code:', qrError)
      // Continue without QR code - don't fail the registration
    }

    // Send confirmation email
    try {
      const eventLocation = event.locationType === 'virtual'
        ? 'Virtual Event'
        : event.locationCity && event.locationState
          ? `${event.locationCity}, ${event.locationState}`
          : event.locationAddress || 'TBA'

      const emailHtml = renderRegistrationConfirmationEmail({
        userName: registration.user.name || 'there',
        eventTitle: event.title,
        eventDate: formatEventDateRange(
          new Date(event.startDatetime),
          new Date(event.endDatetime)
        ),
        eventLocation,
        ticketNumber: registration.ticketNumber,
        qrCodeUrl,
      })

      await sendEmail({
        to: registration.user.email!,
        subject: `Registration Confirmed: ${event.title}`,
        html: emailHtml,
      })
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
      // Continue - email failure shouldn't fail the registration
    }

    return NextResponse.json({
      success: true,
      registration: {
        ...registration,
        qrCodeUrl,
      },
      message: event.approvalMode === 'automated' 
        ? 'Successfully registered! Check your email for confirmation.' 
        : 'Registration submitted and pending approval. Check your email for updates.',
    })
  } catch (error) {
    console.error('Error registering for event:', error)
    return NextResponse.json(
      { error: 'Failed to register for event' },
      { status: 500 }
    )
  }
}
