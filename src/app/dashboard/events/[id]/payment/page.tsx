'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const eventId = params.id as string
  const registrationId = searchParams.get('registration')
  
  const [loading, setLoading] = useState(false)
  const [event, setEvent] = useState<any>(null)

  useEffect(() => {
    fetchEventDetails()
  }, [eventId])

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`)
      const data = await response.json()
      setEvent(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load event details',
        variant: 'destructive',
      })
    }
  }

  const handlePayment = async () => {
    if (!registrationId) {
      toast({
        title: 'Error',
        description: 'Registration ID is missing',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          registrationId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to Paystack payment page
        window.location.href = data.authorization_url
      } else {
        throw new Error(data.error || 'Payment initialization failed')
      }
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      })
      setLoading(false)
    }
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Event Details */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(event.startDatetime).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Payment Amount */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Ticket Price</span>
              <span className="text-2xl font-bold">
                {event.currency} {Number(event.price).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✓ Secure payment powered by Paystack</p>
            <p>✓ Instant confirmation via email</p>
            <p>✓ QR code ticket included</p>
          </div>

          {/* Pay Button */}
          <Button
            onClick={handlePayment}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Proceed to Payment
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            You will be redirected to Paystack to complete your payment securely
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
