'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Loader2,
  ExternalLink,
  Download,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TransitionLink } from '@/components/ui/transition-link'
import { useToast } from '@/hooks/use-toast'
import { formatEventDateRange } from '@/lib/utils/event-utils'
import { format } from 'date-fns'

interface Registration {
  id: string
  ticketNumber: string
  registrationStatus: string
  approvalStatus: string | null
  registeredAt: string
  event: {
    id: string
    title: string
    description: string
    startDatetime: string
    endDatetime: string
    locationType: string
    locationAddress: string | null
    locationCity: string | null
    locationState: string | null
    liveEventUrl: string | null
    bannerImageUrl: string | null
    category: string | null
    isFree: boolean
    price: number | null
    currency: string
  }
}

export default function MyRegistrationsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/registrations/my-registrations')
      
      if (!response.ok) {
        throw new Error('Failed to fetch registrations')
      }

      const data = await response.json()
      setRegistrations(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load your registrations',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelRegistration = async (registrationId: string) => {
    if (!confirm('Are you sure you want to cancel this registration?')) {
      return
    }

    try {
      const response = await fetch(`/api/registrations/${registrationId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to cancel registration')
      }

      toast({
        title: 'Registration cancelled',
        description: 'Your registration has been cancelled successfully',
      })

      fetchRegistrations()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel registration',
        variant: 'destructive',
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string; color: string }> = {
      confirmed: { variant: 'default', label: 'Confirmed', color: 'bg-green-500' },
      pending_approval: { variant: 'secondary', label: 'Pending Approval', color: 'bg-yellow-500' },
      pending_email: { variant: 'secondary', label: 'Pending Email', color: 'bg-blue-500' },
      cancelled: { variant: 'destructive', label: 'Cancelled', color: 'bg-red-500' },
    }

    const config = variants[status] || { variant: 'outline', label: status, color: 'bg-gray-500' }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getLocationDisplay = (registration: Registration) => {
    const { event } = registration
    if (event.locationType === 'virtual') return 'Virtual Event'
    if (event.locationCity && event.locationState) {
      return `${event.locationCity}, ${event.locationState}`
    }
    return event.locationAddress || 'Physical Location'
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
        <h1 className="text-3xl font-bold mb-2">My Registrations</h1>
        <p className="text-muted-foreground">
          Events you've registered for
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Registrations</p>
                <p className="text-2xl font-bold">{registrations.length}</p>
              </div>
              <Ticket className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold">
                  {registrations.filter(r => r.registrationStatus === 'confirmed').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {registrations.filter(r => r.registrationStatus === 'pending_approval').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registrations List */}
      {registrations.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No registrations yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't registered for any events yet
            </p>
            <TransitionLink href="/dashboard/find-events">
              <Button>
                Browse Events
              </Button>
            </TransitionLink>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {registrations.map((registration, index) => {
            const isPast = new Date(registration.event.endDatetime) < new Date()
            const isUpcoming = new Date(registration.event.startDatetime) > new Date()

            return (
              <motion.div
                key={registration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    {/* Event Image */}
                    <div className="md:w-48 h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex-shrink-0">
                      {registration.event.bannerImageUrl ? (
                        <img
                          src={registration.event.bannerImageUrl}
                          alt={registration.event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Calendar className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Event Details */}
                    <CardContent className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(registration.registrationStatus)}
                            {isPast && <Badge variant="outline">Past Event</Badge>}
                            {isUpcoming && <Badge variant="outline">Upcoming</Badge>}
                          </div>
                          <h3 className="text-xl font-semibold mb-2">
                            {registration.event.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {registration.event.description}
                          </p>
                        </div>
                      </div>

                      {/* Event Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {formatEventDateRange(
                              new Date(registration.event.startDatetime),
                              new Date(registration.event.endDatetime)
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {getLocationDisplay(registration)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Ticket className="h-4 w-4 text-muted-foreground" />
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {registration.ticketNumber}
                          </code>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-4 border-t">
                        <TransitionLink href={`/dashboard/events/${registration.event.id}`}>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Event
                          </Button>
                        </TransitionLink>

                        {registration.event.locationType === 'virtual' && registration.event.liveEventUrl && (
                          <a
                            href={registration.event.liveEventUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="default" size="sm">
                              Join Live Event →
                            </Button>
                          </a>
                        )}

                        {registration.registrationStatus !== 'cancelled' && !isPast && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 ml-auto"
                            onClick={() => handleCancelRegistration(registration.id)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Registration
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
