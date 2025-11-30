import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, MapPin, Users, Clock, Tag, User, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

async function getEvent(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          registrations: true,
        },
      },
    },
  })

  return event
}

export default async function EventDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const event = await getEvent(params.id)

  if (!event) {
    notFound()
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
        <Link href="/find-events">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
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
              {event.tags.map((tag) => (
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
                    {event.locationType === 'virtual' && event.locationVirtualLink && (
                      <a 
                        href={event.locationVirtualLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Join Link
                      </a>
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
                {isPast ? (
                  <Button className="w-full" variant="outline" disabled>
                    Event Ended
                  </Button>
                ) : isFull ? (
                  <Button className="w-full" variant="outline" disabled>
                    Event Full
                  </Button>
                ) : (
                  <Button className="w-full" asChild>
                    <Link href="/login">
                      Register Now
                    </Link>
                  </Button>
                )}
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Login required to register
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
