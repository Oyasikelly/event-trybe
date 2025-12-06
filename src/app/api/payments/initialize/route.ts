import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { paystackService } from '@/lib/payments/paystack'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { eventId, registrationId } = await request.json()

    // Get registration and event details
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        event: true,
        user: true,
      },
    })

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    // Verify user owns this registration
    if (registration.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if event is paid
    if (registration.event.isFree) {
      return NextResponse.json({ error: 'This is a free event' }, { status: 400 })
    }

    // Check if already paid
    if (registration.paymentStatus === 'PAID') {
      return NextResponse.json({ error: 'Already paid' }, { status: 400 })
    }

    const amount = Number(registration.event.price) * 100 // Convert to kobo
    const reference = `evt_${eventId}_reg_${registrationId}_${Date.now()}`

    // Initialize payment with Paystack
    const paymentResponse = await paystackService.initializePayment({
      email: registration.user.email!,
      amount,
      reference,
      metadata: {
        eventId,
        registrationId,
        userId: session.user.id,
        eventTitle: registration.event.title,
      },
      callback_url: `${process.env.NEXTAUTH_URL}/dashboard/events/${eventId}/payment/verify?reference=${reference}`,
    })

    // Create payment record
    await prisma.payment.create({
      data: {
        registrationId,
        eventId,
        userId: session.user.id,
        amount: registration.event.price!,
        currency: registration.event.currency,
        provider: 'paystack',
        providerReference: reference,
        internalReference: reference,
        status: 'pending',
        metadata: {
          access_code: paymentResponse.data.access_code,
        },
      },
    })

    // Update registration
    await prisma.registration.update({
      where: { id: registrationId },
      data: {
        paymentStatus: 'PENDING',
        paymentReference: reference,
        paymentProvider: 'paystack',
      },
    })

    return NextResponse.json({
      success: true,
      authorization_url: paymentResponse.data.authorization_url,
      reference,
    })
  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    )
  }
}
