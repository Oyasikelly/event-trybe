'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, Mail, Calendar, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

interface Registration {
  id: string
  eventId: string
  ticketNumber: string
  registrationStatus: string
  approvalStatus: string | null
  registeredAt: string
  user: {
    id: string
    name: string | null
    email: string | null
    profileImageUrl: string | null
  }
}

interface RegistrationsTableProps {
  registrations: Registration[]
  approvalMode: string
  eventId: string
  onUpdate: () => void
}

export function RegistrationsTable({
  registrations,
  approvalMode,
  eventId,
  onUpdate,
}: RegistrationsTableProps) {
  const { toast } = useToast()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleApprove = async (registrationId: string) => {
    setLoadingId(registrationId)
    try {
      const response = await fetch(
        `/api/events/${eventId}/registrations/${registrationId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'approve' }),
        }
      )

      if (!response.ok) throw new Error('Failed to approve registration')

      toast({
        title: 'Registration approved',
        description: 'The user has been notified',
      })
      onUpdate()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve registration',
        variant: 'destructive',
      })
    } finally {
      setLoadingId(null)
    }
  }

  const handleReject = async (registrationId: string) => {
    setLoadingId(registrationId)
    try {
      const response = await fetch(
        `/api/events/${eventId}/registrations/${registrationId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'reject' }),
        }
      )

      if (!response.ok) throw new Error('Failed to reject registration')

      toast({
        title: 'Registration rejected',
        description: 'The user has been notified',
      })
      onUpdate()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject registration',
        variant: 'destructive',
      })
    } finally {
      setLoadingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      confirmed: { variant: 'default', label: 'Confirmed' },
      pending_approval: { variant: 'secondary', label: 'Pending' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
    }

    const config = variants[status] || { variant: 'outline', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (registrations.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No registrations yet</h3>
        <p className="text-muted-foreground">
          Registrations will appear here once users sign up
        </p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Ticket #</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Registered</TableHead>
            {approvalMode === 'manual' && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map((registration, index) => (
            <motion.tr
              key={registration.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={registration.user.profileImageUrl || undefined} />
                    <AvatarFallback>
                      {registration.user.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {registration.user.name || 'Anonymous'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {registration.user.email}
                </div>
              </TableCell>
              <TableCell>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {registration.ticketNumber}
                </code>
              </TableCell>
              <TableCell>{getStatusBadge(registration.registrationStatus)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(registration.registeredAt), 'MMM d, yyyy')}
                </div>
              </TableCell>
              {approvalMode === 'manual' && (
                <TableCell>
                  {registration.registrationStatus === 'pending_approval' && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(registration.id)}
                        disabled={loadingId === registration.id}
                      >
                        {loadingId === registration.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(registration.id)}
                        disabled={loadingId === registration.id}
                      >
                        {loadingId === registration.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </TableCell>
              )}
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
