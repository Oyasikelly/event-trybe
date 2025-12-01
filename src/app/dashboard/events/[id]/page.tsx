'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, MapPin, Users, Clock, Tag, User, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

interface Event {
  id: string
  title: string
  description: string
  startDatetime: string
  endDatetime: string
  locationType: string
  locationAddress: string | null
  locationVirtualLink: string | null
  liveEventUrl: string | null
  capacityLimit: number | null
  category: string | null
  tags: string[]
  approvalMode: string
  owner: {
    name: string | null
    email: string | null
  }
  _count: {
    registrations: number
  }
}

export default function EventDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`)
        if (!response.ok) throw new Error('Event not found')
        
        const data = await response.json()
        setEvent(data)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load event',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchEvent()
    }
  }, [params.id, toast])

  const handleRegister = async () => {
    if (!event) return

    setIsRegistering(true)
    try {
      const response = await fetch(`/api/events/${event.id}/register`, {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to register')
      }

      setIsRegistered(true)
      toast({
        title: 'Registration successful!',
        description: event.approvalMode === 'automated' 
          ? 'You are now registered for this event.' 
          : 'Your registration is pending approval.',
      })
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      })
    } finally {
      setIsRegistering(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-muted-foreground mb-4">The event you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const spotsLeft = event.capacityLimit 
    ? event.capacityLimit - event._count.registrations 
    : null
  const isFull = spotsLeft !== null && spotsLeft <= 0
  const isPast = new Date(event.endDatetime) < new Date()
  const isOngoing = new Date(event.startDatetime) <= new Date() && new Date(event.endDatetime) >= new Date()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/dashboard/events/my-events">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Events
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Banner */}
          <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Calendar className="h-24 w-24 text-primary/40" />
          </div>

          {/* Title and Category */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {event.category && (
                <Badge variant="secondary">{event.category}</Badge>
              )}
              {isPast && <Badge variant="outline">Past Event</Badge>}
              {isOngoing && <Badge className="bg-green-500">Ongoing</Badge>}
              {event.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl font-bold">{event.title}</h1>
          </div>

          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">About This Event</h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{event.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Organizer */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Organized By</h2>
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{event.owner.name}</p>
                  <p className="text-sm text-muted-foreground">Event Organizer</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Details Card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Event Details</h2>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.startDatetime), 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.startDatetime), 'h:mm a')} - {format(new Date(event.endDatetime), 'h:mm a')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {event.locationType === 'physical' 
                        ? event.locationAddress || 'Physical Location'
                        : 'Virtual Event'}
                    </p>
                    {event.locationType === 'virtual' && event.liveEventUrl && (
                      <a 
                        href={event.liveEventUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        Join Live Event →
                      </a>
                    )}
                    {event.locationType === 'virtual' && !event.liveEventUrl && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Link will be provided closer to event date
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Attendees</p>
                    <p className="text-sm text-muted-foreground">
                      {event._count.registrations} registered
                      {spotsLeft !== null && (
                        <span className="ml-1">
                          • {isFull ? 'Event Full' : `${spotsLeft} spots left`}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">Registration</p>
                    <p className="text-sm text-muted-foreground">
                      {event.approvalMode === 'automated' 
                        ? 'Instant confirmation' 
                        : 'Requires approval'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Register Button */}
              <div className="pt-4">
                {isRegistered ? (
                  <Button className="w-full" variant="outline" disabled>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Registered
                  </Button>
                ) : isPast ? (
                  <Button className="w-full" variant="outline" disabled>
                    Event Ended
                  </Button>
                ) : isFull ? (
                  <Button className="w-full" variant="outline" disabled>
                    Event Full
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={handleRegister}
                    disabled={isRegistering}
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      'Register Now'
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
