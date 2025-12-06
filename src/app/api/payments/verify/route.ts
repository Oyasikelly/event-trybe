import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { paystackService } from '@/lib/payments/paystack'
import { sendEmail } from '@/lib/email/send-email'
import { renderRegistrationConfirmationEmail } from '@/lib/email/templates/registration-confirmation'
import { formatEventDateRange } from '@/lib/utils/event-utils'
import {
  generateICSFile,
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
  generateOffice365CalendarUrl,
  generateYahooCalendarUrl,
} from '@/lib/utils/calendar'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json({ error: 'Reference required' }, { status: 400 })
    }

    // Verify payment with Paystack
    const verificationResponse = await paystackService.verifyPayment(reference)

    if (!verificationResponse.status) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    const paymentData = verificationResponse.data

    // Get payment record
    const payment = await prisma.payment.findUnique({
      where: { providerReference: reference },
      include: {
        registration: {
          include: {
            event: true,
            user: true,
          },
        },
      },
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Check if payment was successful
    if (paymentData.status === 'success') {
      // Update payment record
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'successful',
          metadata: paymentData,
        },
      })

      // Update registration
      await prisma.registration.update({
        where: { id: payment.registrationId },
        data: {
          paymentStatus: 'PAID',
          amountPaid: payment.amount,
          paidAt: new Date(paymentData.paid_at),
          registrationStatus: 'confirmed',
        },
      })

      // Send confirmation email with calendar invite
      try {
        const event = payment.registration.event
        const eventLocation = event.locationType === 'virtual'
          ? 'Virtual Event'
          : event.locationCity && event.locationState
            ? `${event.locationCity}, ${event.locationState}`
            : event.locationAddress || 'TBA'

        // Generate calendar URLs
        const eventDetails = {
          title: event.title,
          description: `You're registered for ${event.title}. Ticket: ${payment.registration.ticketNumber}`,
          location: eventLocation,
          startDatetime: new Date(event.startDatetime),
          endDatetime: new Date(event.endDatetime),
        }

        const googleCalendarUrl = generateGoogleCalendarUrl(eventDetails)
        const outlookCalendarUrl = generateOutlookCalendarUrl(eventDetails)
        const office365CalendarUrl = generateOffice365CalendarUrl(eventDetails)
        const yahooCalendarUrl = generateYahooCalendarUrl(eventDetails)

        // Generate ICS file
        const icsContent = generateICSFile(eventDetails)

        const emailHtml = renderRegistrationConfirmationEmail({
          userName: payment.registration.user.name || 'there',
          eventTitle: event.title,
          eventDate: formatEventDateRange(
            new Date(event.startDatetime),
            new Date(event.endDatetime)
          ),
          eventLocation,
          ticketNumber: payment.registration.ticketNumber,
          qrCodeUrl: payment.registration.qrCode || undefined,
          googleCalendarUrl,
          outlookCalendarUrl,
          office365CalendarUrl,
          yahooCalendarUrl,
        })

        await sendEmail({
          to: payment.registration.user.email!,
          subject: `Payment Confirmed - ${event.title}`,
          html: emailHtml,
          attachments: [
            {
              filename: `${event.title.replace(/[^a-z0-9]/gi, '_')}_event.ics`,
              content: icsContent,
              contentType: 'text/calendar; charset=utf-8',
            },
          ],
        })

        // Update registration to mark calendar invite as sent
        await prisma.registration.update({
          where: { id: payment.registrationId },
          data: { calendarInviteSent: true },
        })
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError)
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        payment: {
          status: 'successful',
          amount: payment.amount,
          currency: payment.currency,
        },
      })
    } else {
      // Payment failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'failed',
          metadata: paymentData,
        },
      })

      await prisma.registration.update({
        where: { id: payment.registrationId },
        data: {
          paymentStatus: 'FAILED',
        },
      })

      return NextResponse.json({
        success: false,
        message: 'Payment failed',
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
