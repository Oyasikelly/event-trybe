'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Calendar,
  MapPin,
  Users,
  Search,
  Filter,
  Clock,
  Loader2,
  Tag,
  Crown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TransitionLink } from '@/components/ui/transition-link'
import { useToast } from '@/hooks/use-toast'
import { formatEventDateRange, getCategoryIcon } from '@/lib/utils/event-utils'
import { eventCategories } from '@/lib/validations/event'

interface Event {
  id: string
  title: string
  slug: string
  description: string
  category: string | null
  eventType: string
  startDatetime: string
  endDatetime: string
  locationType: string
  locationCity: string | null
  locationState: string | null
  isFree: boolean
  price: number | null
  currency: string
  capacityLimit: number | null
  bannerImageUrl: string | null
  tags: string[]
  ownerId: string
  owner: {
    name: string | null
  }
  _count: {
    registrations: number
  }
}

export default function FindEventsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    fetchCurrentUser()
    fetchEvents()
    
    // Auto-refresh every 30 seconds for latest events
    const interval = setInterval(() => {
      fetchEvents()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchQuery, categoryFilter, typeFilter])

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/session')
      if (response.ok) {
        const session = await response.json()
        setCurrentUserId(session?.user?.id || null)
      }
    } catch (error) {
      console.error('Error fetching current user:', error)
    }
  }

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/events/public')
      
      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }

      const data = await response.json()
      setEvents(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load events',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const filterEvents = () => {
    let filtered = events

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(event => event.category === categoryFilter)
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(event => event.eventType === typeFilter)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredEvents(filtered)
  }

  const getLocationDisplay = (event: Event) => {
    if (event.locationType === 'virtual') return 'Virtual Event'
    if (event.locationCity && event.locationState) {
      return `${event.locationCity}, ${event.locationState}`
    }
    return 'Physical Location'
  }

  const getSpotsLeft = (event: Event) => {
    if (!event.capacityLimit) return null
    return event.capacityLimit - event._count.registrations
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Events</h1>
        <p className="text-muted-foreground">
          Discover and register for upcoming events
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {eventCategories.map((category: string) => (
              <SelectItem key={category} value={category}>
                {category.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="IN_PERSON">In Person</SelectItem>
            <SelectItem value="VIRTUAL">Virtual</SelectItem>
            <SelectItem value="HYBRID">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
        </p>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search query
            </p>
            <Button onClick={() => {
              setSearchQuery('')
              setCategoryFilter('all')
              setTypeFilter('all')
            }}>
              Clear Filters
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => {
            const spotsLeft = getSpotsLeft(event)
            const isFull = spotsLeft !== null && spotsLeft <= 0
            const isPast = new Date(event.endDatetime) < new Date()

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`overflow-hidden hover:shadow-lg transition-shadow h-full flex-col ${event.ownerId === currentUserId ? 'ring-2 ring-primary/50' : ''}`}>
                  {/* Event Image */}
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5">
                    {event.bannerImageUrl ? (
                      <img
                        src={event.bannerImageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-6xl">{getCategoryIcon(event.category || '')}</span>
                      </div>
                    )}
                    
                    {/* Your Event Badge - Top Left */}
                    {event.ownerId === currentUserId && currentUserId && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          Your Event
                        </Badge>
                      </div>
                    )}
                    
                    {isPast && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="outline" className="bg-background/80 backdrop-blur">
                          Past Event
                        </Badge>
                      </div>
                    )}
                    {isFull && !isPast && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="destructive" className="bg-red-500">
                          Full
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6 flex-1 flex flex-col">
                    {/* Category & Type */}
                    <div className="flex items-center gap-2 mb-3">
                      {event.category && (
                        <Badge variant="secondary" className="text-xs">
                          {event.category.replace('_', ' ')}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {event.eventType.replace('_', ' ')}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {formatEventDateRange(new Date(event.startDatetime), new Date(event.endDatetime))}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {getLocationDisplay(event)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">
                          {event._count.registrations} registered
                          {spotsLeft !== null && ` • ${spotsLeft} spots left`}
                        </span>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        {event.isFree ? (
                          <span className="text-lg font-bold text-green-600">Free</span>
                        ) : (
                          <span className="text-lg font-bold">
                            {event.currency} {event.price?.toString()}
                          </span>
                        )}
                      </div>
                      <TransitionLink href={`/dashboard/events/${event.id}`}>
                        <Button size="sm" disabled={isPast || isFull}>
                          {isPast ? 'Ended' : isFull ? 'Full' : 'View Details'}
                        </Button>
                      </TransitionLink>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
