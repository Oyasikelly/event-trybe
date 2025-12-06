'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PaymentVerifyPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const eventId = params.id as string
  const reference = searchParams.get('reference')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (reference) {
      verifyPayment()
    }
  }, [reference])

  const verifyPayment = async () => {
    try {
      const response = await fetch(`/api/payments/verify?reference=${reference}`)
      const data = await response.json()

      if (response.ok && data.success) {
        setStatus('success')
        setMessage('Your payment has been confirmed!')
      } else {
        setStatus('failed')
        setMessage(data.message || 'Payment verification failed')
      }
    } catch (error) {
      setStatus('failed')
      setMessage('An error occurred while verifying your payment')
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {status === 'loading' && 'Verifying Payment...'}
            {status === 'success' && 'Payment Successful!'}
            {status === 'failed' && 'Payment Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center py-8">
            {status === 'loading' && (
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            )}
            
            {status === 'success' && (
              <>
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <p className="text-center text-muted-foreground mb-6">
                  {message}
                </p>
                <p className="text-sm text-center text-muted-foreground mb-6">
                  A confirmation email with your ticket and QR code has been sent to your email address.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => router.push(`/dashboard/events/${eventId}`)}
                    variant="outline"
                  >
                    View Event
                  </Button>
                  <Button onClick={() => router.push('/dashboard/events/my-events')}>
                    My Events
                  </Button>
                </div>
              </>
            )}
            
            {status === 'failed' && (
              <>
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
                <p className="text-center text-muted-foreground mb-6">
                  {message}
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => router.push(`/dashboard/events/${eventId}`)}
                    variant="outline"
                  >
                    Back to Event
                  </Button>
                  <Button onClick={() => router.push(`/dashboard/events/${eventId}/payment?registration=${searchParams.get('registration')}`)}>
                    Try Again
                  </Button>
                </div>
              </>
            )}
          </div>

          {reference && (
            <div className="text-xs text-center text-muted-foreground">
              Reference: {reference}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
