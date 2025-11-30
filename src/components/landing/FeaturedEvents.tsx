import Link from 'next/link'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { AnimatedEventCard, AnimatedSection } from '@/components/animations/AnimatedWrappers'

async function getFeaturedEvents() {
  try {
    const events = await prisma.event.findMany({
      where: {
        status: 'published',
        startDatetime: {
          gte: new Date(),
        },
      },
      include: {
        owner: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
      orderBy: {
        startDatetime: 'asc',
      },
      take: 6,
    })

    return events
  } catch (error) {
    console.error('Failed to fetch featured events:', error)
    return []
  }
}

type FeaturedEvent = Awaited<ReturnType<typeof getFeaturedEvents>>[number]

export async function FeaturedEvents() {
  const events = await getFeaturedEvents()

  if (events.length === 0) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Featured Events</h2>
            <p className="text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection>
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Featured Events</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover amazing events happening near you
            </p>
          </div>
        </AnimatedSection>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: FeaturedEvent, index: number) => {
            const spotsLeft = event.capacityLimit 
              ? event.capacityLimit - event._count.registrations 
              : null
            const isFull = spotsLeft !== null && spotsLeft <= 0

            return (
              <AnimatedEventCard key={event.id} index={index}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                <CardHeader className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Calendar className="h-16 w-16 text-primary/40" />
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {/* Category Badge */}
                  {event.category && (
                    <Badge variant="secondary">{event.category}</Badge>
                  )}

                  {/* Title */}
                  <h3 className="font-semibold text-xl line-clamp-2">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(new Date(event.startDatetime), 'MMM d, yyyy • h:mm a')}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      {event.locationType === 'physical' 
                        ? 'In-person' 
                        : 'Virtual Event'}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="mr-2 h-4 w-4" />
                      {event._count.registrations} registered
                      {spotsLeft !== null && (
                        <span className="ml-1">
                          • {isFull ? 'Full' : `${spotsLeft} spots left`}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button 
                    className="w-full" 
                    variant={isFull ? "outline" : "default"}
                    disabled={isFull}
                    asChild
                  >
                    <Link href={`/events/${event.id}`}>
                      {isFull ? 'Event Full' : 'View Details'}
                      {!isFull && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </AnimatedEventCard>
            )
          })}
        </div>

        {/* View All Link */}
        <AnimatedSection>
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/find-events">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
