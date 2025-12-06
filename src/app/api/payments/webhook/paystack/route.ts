import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { paystackService } from '@/lib/payments/paystack'

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    // Verify webhook signature
    const isValid = paystackService.verifyWebhookSignature(body, signature)
    
    if (!isValid) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)

    // Handle different event types
    if (event.event === 'charge.success') {
      const { reference, amount, currency, paid_at } = event.data

      // Find payment record
      const payment = await prisma.payment.findUnique({
        where: { providerReference: reference },
      })

      if (!payment) {
        console.error(`Payment not found for reference: ${reference}`)
        return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
      }

      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'successful',
          metadata: event.data,
        },
      })

      // Update registration
      await prisma.registration.update({
        where: { id: payment.registrationId },
        data: {
          paymentStatus: 'PAID',
          amountPaid: payment.amount,
          paidAt: new Date(paid_at),
          registrationStatus: 'confirmed',
        },
      })

      console.log(`✅ Payment confirmed via webhook: ${reference}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
