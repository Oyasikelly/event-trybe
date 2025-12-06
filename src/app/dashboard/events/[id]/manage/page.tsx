'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Search, Filter, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { AnalyticsGrid } from '@/components/events/manage/AnalyticsGrid'
import { RegistrationsTable } from '@/components/events/manage/RegistrationsTable'
import { EventActions } from '@/components/events/manage/EventActions'

interface Event {
  id: string
  title: string
  status: string
  approvalMode: string
  capacityLimit: number | null
  ownerId: string
}

interface Analytics {
  totalRegistrations: number
  confirmedRegistrations: number
  pendingRegistrations: number
  cancelledRegistrations: number
  capacityUsed: number | null
  capacityLimit: number | null
}

interface Registration {
  id: string
  ticketNumber: string
  registrationStatus: string
  approvalStatus: string | null
  registeredAt: string
  eventId: string
  user: {
    id: string
    name: string | null
    email: string | null
    profileImageUrl: string | null
  }
}

export default function EventManagePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const [event, setEvent] = useState<Event | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchData()
  }, [params.id, statusFilter, searchQuery])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch event details
      const eventRes = await fetch(`/api/events/${params.id}`)
      if (!eventRes.ok) {
        if (eventRes.status === 403) {
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to manage this event',
            variant: 'destructive',
          })
          router.push('/dashboard/events/my-events')
          return
        }
        throw new Error('Failed to fetch event')
      }
      const eventData = await eventRes.json()
      setEvent(eventData)

      // Fetch analytics
      const analyticsRes = await fetch(`/api/events/${params.id}/analytics`)
      if (!analyticsRes.ok) {
        if (analyticsRes.status === 403) {
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to manage this event',
            variant: 'destructive',
          })
          router.push('/dashboard/events/my-events')
          return
        }
        throw new Error('Failed to fetch analytics')
      }
      const analyticsData = await analyticsRes.json()
      setAnalytics(analyticsData)

      // Fetch registrations
      const registrationsRes = await fetch(
        `/api/events/${params.id}/registrations?status=${statusFilter}&search=${searchQuery}`
      )
      if (registrationsRes.ok) {
        const registrationsData = await registrationsRes.json()
        setRegistrations(registrationsData.registrations)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load event data',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!event || !analytics) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The event you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => router.push('/dashboard/events/my-events')}>
            Back to My Events
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard/events/my-events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Events
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <p className="text-muted-foreground">
              Manage registrations and view analytics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/events/${event.id}/attendees`}>
                <Users className="mr-2 h-4 w-4" />
                Manage Attendees
              </Link>
            </Button>
            <EventActions
              eventId={event.id}
              eventTitle={event.title}
              eventStatus={event.status}
            />
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <AnalyticsGrid
          totalRegistrations={analytics.totalRegistrations}
          confirmedRegistrations={analytics.confirmedRegistrations}
          pendingRegistrations={analytics.pendingRegistrations}
          capacityUsed={analytics.capacityUsed}
          capacityLimit={analytics.capacityLimit}
        />
      </motion.div>

      {/* Registrations Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Registrations</h2>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending_approval">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Registrations Table */}
        <RegistrationsTable
          registrations={registrations}
          approvalMode={event.approvalMode}
          eventId={event.id}
          onUpdate={fetchData}
        />
      </motion.div>
    </div>
  )
}
