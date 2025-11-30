import Link from 'next/link'
import { Calendar, MapPin, Users, Search, Filter } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

async function getEvents() {
  const now = new Date()
  
  const [allEvents, upcomingEvents, ongoingEvents, pastEvents] = await Promise.all([
    // All published events
    prisma.event.findMany({
      where: { status: 'published' },
      include: {
        owner: { select: { name: true } },
        _count: { select: { registrations: true } },
      },
      orderBy: { startDatetime: 'desc' },
    }),
    // Upcoming events
    prisma.event.findMany({
      where: {
        status: 'published',
        startDatetime: { gt: now },
      },
      include: {
        owner: { select: { name: true } },
        _count: { select: { registrations: true } },
      },
      orderBy: { startDatetime: 'asc' },
    }),
    // Ongoing events
    prisma.event.findMany({
      where: {
        status: 'published',
        startDatetime: { lte: now },
        endDatetime: { gte: now },
      },
      include: {
        owner: { select: { name: true } },
        _count: { select: { registrations: true } },
      },
      orderBy: { startDatetime: 'desc' },
    }),
    // Past events
    prisma.event.findMany({
      where: {
        status: { in: ['published', 'completed'] },
        endDatetime: { lt: now },
      },
      include: {
        owner: { select: { name: true } },
        _count: { select: { registrations: true } },
      },
      orderBy: { startDatetime: 'desc' },
      take: 20,
    }),
  ])

  return { allEvents, upcomingEvents, ongoingEvents, pastEvents }
}

function EventCard({ event }: { event: any }) {
  const spotsLeft = event.capacityLimit 
    ? event.capacityLimit - event._count.registrations 
    : null
  const isFull = spotsLeft !== null && spotsLeft <= 0
  const isPast = new Date(event.endDatetime) < new Date()

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
          <Calendar className="h-16 w-16 text-primary/40" />
          {isPast && (
            <Badge className="absolute top-4 right-4" variant="secondary">
              Past Event
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {event.category && (
          <Badge variant="secondary">{event.category}</Badge>
        )}
        <h3 className="font-semibold text-xl line-clamp-2">
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {format(new Date(event.startDatetime), 'MMM d, yyyy • h:mm a')}
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            {event.locationType === 'physical' ? 'In-person' : 'Virtual Event'}
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
          variant={isFull || isPast ? "outline" : "default"}
          disabled={isFull && !isPast}
          asChild
        >
          <Link href={`/events/${event.id}`}>
            {isFull ? 'Event Full' : isPast ? 'View Details' : 'View & Register'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default async function FindEventsPage() {
  const { allEvents, upcomingEvents, ongoingEvents, pastEvents } = await getEvents()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-bold">Find Events</h1>
        <p className="text-lg text-muted-foreground">
          Discover amazing events happening around you
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search events..." 
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="all">
            All ({allEvents.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="ongoing">
            Ongoing ({ongoingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastEvents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {allEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No upcoming events</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ongoing" className="space-y-6">
          {ongoingEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No ongoing events</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          {pastEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No past events</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
