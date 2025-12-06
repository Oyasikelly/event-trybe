'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AttendeeFilters, FilterState } from '@/components/events/manage/AttendeeFilters'
import { BulkEmailComposer } from '@/components/events/manage/BulkEmailComposer'
import { useToast } from '@/hooks/use-toast'

interface Attendee {
  id: string
  ticketNumber: string
  registrationStatus: string
  registeredAt: string
  checkedInAt: string | null
  user: {
    name: string
    email: string
  }
}

export default function AttendeesPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const eventId = params.id as string

  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    checkedIn: 'all',
  })
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false)

  useEffect(() => {
    fetchAttendees()
  }, [eventId])

  const fetchAttendees = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/registrations`)
      if (!response.ok) throw new Error('Failed to fetch attendees')

      const data = await response.json()
      setAttendees(data.registrations || [])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load attendees',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter attendees based on current filters
  const filteredAttendees = useMemo(() => {
    return attendees.filter((attendee) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          attendee.user.name.toLowerCase().includes(searchLower) ||
          attendee.user.email.toLowerCase().includes(searchLower) ||
          attendee.ticketNumber.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Status filter
      if (filters.status !== 'all' && attendee.registrationStatus !== filters.status) {
        return false
      }

      // Check-in filter
      if (filters.checkedIn === 'true' && !attendee.checkedInAt) {
        return false
      }
      if (filters.checkedIn === 'false' && attendee.checkedInAt) {
        return false
      }

      return true
    })
  }, [attendees, filters])

  const handleExport = () => {
    const queryParams = new URLSearchParams()
    if (filters.status !== 'all') queryParams.set('status', filters.status)
    if (filters.checkedIn !== 'all') queryParams.set('checkedIn', filters.checkedIn)

    const url = `/api/events/${eventId}/attendees/export?${queryParams.toString()}`
    window.open(url, '_blank')

    toast({
      title: 'Export Started',
      description: 'Your CSV file will download shortly',
    })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      confirmed: { variant: 'default', label: 'Confirmed' },
      pending_email: { variant: 'secondary', label: 'Pending Email' },
      pending_approval: { variant: 'secondary', label: 'Pending Approval' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
      rejected: { variant: 'destructive', label: 'Rejected' },
    }

    const config = variants[status] || { variant: 'secondary', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Event
        </Button>
        <h1 className="text-3xl font-bold">Manage Attendees</h1>
        <p className="text-muted-foreground mt-1">
          View, filter, and communicate with your event attendees
        </p>
      </div>

      {/* Filters */}
      <AttendeeFilters
        onFilterChange={setFilters}
        onExport={handleExport}
        onBulkEmail={() => setIsEmailComposerOpen(true)}
        totalCount={attendees.length}
        filteredCount={filteredAttendees.length}
      />

      {/* Attendees Table */}
      <div className="mt-6 border rounded-lg">
        {filteredAttendees.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No attendees found</p>
            {filters.search || filters.status !== 'all' || filters.checkedIn !== 'all' ? (
              <p className="text-sm mt-2">Try adjusting your filters</p>
            ) : (
              <p className="text-sm mt-2">No one has registered yet</p>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ticket #</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Check-in</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendees.map((attendee) => (
                <TableRow key={attendee.id}>
                  <TableCell className="font-medium">
                    {attendee.user.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {attendee.user.email}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {attendee.ticketNumber}
                    </code>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(attendee.registrationStatus)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(attendee.registeredAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {attendee.checkedInAt ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm">
                          {new Date(attendee.checkedInAt).toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm">Not checked in</span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Bulk Email Composer */}
      <BulkEmailComposer
        isOpen={isEmailComposerOpen}
        onClose={() => setIsEmailComposerOpen(false)}
        eventId={eventId}
        recipientCount={filteredAttendees.length}
        filters={filters}
      />
    </div>
  )
}
