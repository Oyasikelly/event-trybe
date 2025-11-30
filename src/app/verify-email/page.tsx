'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Verification token is missing')
        return
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(data.message)
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/login')
          }, 3000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Verification failed')
        }
      } catch (error) {
        setStatus('error')
        setMessage('An error occurred during verification')
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
          <Calendar className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">EventTrybe</span>
        </Link>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
            <CardDescription className="text-center">
              {status === 'loading' && 'Verifying your email...'}
              {status === 'success' && 'Email verified successfully!'}
              {status === 'error' && 'Verification failed'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {status === 'loading' && (
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            )}

            {status === 'success' && (
              <>
                <CheckCircle2 className="h-16 w-16 text-green-600" />
                <p className="text-center text-sm text-muted-foreground">
                  {message}
                </p>
                <p className="text-center text-sm text-muted-foreground">
                  Redirecting to login...
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="h-16 w-16 text-red-600" />
                <p className="text-center text-sm text-red-600">
                  {message}
                </p>
                <Button asChild className="w-full">
                  <Link href="/login">Go to Login</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
