'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Edit, Share2, Ban, Loader2, Check, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { TransitionLink } from '@/components/ui/transition-link'

interface EventActionsProps {
  eventId: string
  eventTitle: string
  eventStatus: string
}

export function EventActions({ eventId, eventTitle, eventStatus }: EventActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isChangingStatus, setIsChangingStatus] = useState(false)

  const handleShare = async () => {
    const url = `${window.location.origin}/dashboard/events/${eventId}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast({
        title: 'Link copied!',
        description: 'Event link has been copied to clipboard',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link',
        variant: 'destructive',
      })
    }
  }

  const handleCancelEvent = async () => {
    setIsCancelling(true)
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      })

      if (!response.ok) throw new Error('Failed to cancel event')

      toast({
        title: 'Event cancelled',
        description: 'All registered users will be notified',
      })
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel event',
        variant: 'destructive',
      })
    } finally {
      setIsCancelling(false)
      setShowCancelDialog(false)
    }
  }

  const handleStatusChange = async (newStatus: 'draft' | 'published') => {
    setIsChangingStatus(true)
    try {
      const response = await fetch(`/api/events/${eventId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update status')

      toast({
        title: 'Status updated',
        description: `Event ${newStatus === 'published' ? 'published' : 'saved as draft'} successfully`,
      })
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update event status',
        variant: 'destructive',
      })
    } finally {
      setIsChangingStatus(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <TransitionLink href={`/dashboard/events/${eventId}/edit`}>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Event
          </Button>
        </TransitionLink>

        <Button variant="outline" onClick={handleShare}>
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </>
          )}
        </Button>

        {eventStatus === 'draft' ? (
          <Button
            variant="default"
            onClick={() => handleStatusChange('published')}
            disabled={isChangingStatus}
          >
            {isChangingStatus ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Publish Now
              </>
            )}
          </Button>
        ) : eventStatus === 'published' ? (
          <Button
            variant="outline"
            onClick={() => handleStatusChange('draft')}
            disabled={isChangingStatus}
          >
            {isChangingStatus ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Unpublishing...
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Unpublish
              </>
            )}
          </Button>
        ) : null}

        {eventStatus !== 'cancelled' && (
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700"
            onClick={() => setShowCancelDialog(true)}
          >
            <Ban className="mr-2 h-4 w-4" />
            Cancel Event
          </Button>
        )}
      </div>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Event?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel "{eventTitle}"? All registered users will be
              notified. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Event</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelEvent}
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Event'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
