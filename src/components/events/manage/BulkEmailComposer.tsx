'use client'

import { useState } from 'react'
import { X, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface BulkEmailComposerProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
  recipientCount: number
  filters?: {
    status?: string
    checkedIn?: string
    search?: string
  }
}

export function BulkEmailComposer({
  isOpen,
  onClose,
  eventId,
  recipientCount,
  filters,
}: BulkEmailComposerProps) {
  const { toast } = useToast()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both subject and message',
        variant: 'destructive',
      })
      return
    }

    setIsSending(true)

    try {
      const response = await fetch(`/api/events/${eventId}/attendees/bulk-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          message,
          filters,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Emails Sent Successfully!',
          description: `Sent to ${data.sentCount} attendees`,
        })
        setSubject('')
        setMessage('')
        onClose()
      } else {
        throw new Error(data.error || 'Failed to send emails')
      }
    } catch (error) {
      toast({
        title: 'Failed to Send Emails',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Email to Attendees</DialogTitle>
          <DialogDescription>
            This will send an email to {recipientCount} attendee{recipientCount !== 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Subject */}
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
            <Input
              id="subject"
              placeholder="Enter email subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isSending}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea
              id="message"
              placeholder="Enter your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSending}
              rows={10}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {message.length} characters
            </p>
          </div>

          {/* Warning */}
          {recipientCount > 50 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ You're sending to {recipientCount} attendees. This may take a few minutes and could hit email rate limits.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="outline" disabled={isSending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
