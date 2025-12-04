'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface NotificationPreferences {
  registrationConfirmation: boolean
  eventReminders: boolean
  eventUpdates: boolean
  approvalStatus: boolean
  newRegistrations: boolean
  eventCancellations: boolean
  marketing: boolean
}

interface NotificationPreferencesProps {
  initialPreferences: NotificationPreferences
}

export function NotificationPreferences({ initialPreferences }: NotificationPreferencesProps) {
  const { toast } = useToast()
  const [preferences, setPreferences] = useState<NotificationPreferences>(initialPreferences)
  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const response = await fetch('/api/settings/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) throw new Error('Failed to save preferences')

      toast({
        title: 'Preferences saved',
        description: 'Your notification preferences have been updated',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save preferences',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Notifications</CardTitle>
        <CardDescription>
          Choose which emails you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="registration-confirmation">Registration Confirmations</Label>
            <p className="text-sm text-muted-foreground">
              Receive confirmation when you register for an event
            </p>
          </div>
          <Switch
            id="registration-confirmation"
            checked={preferences.registrationConfirmation}
            onCheckedChange={() => handleToggle('registrationConfirmation')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="event-reminders">Event Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Get reminders 24 hours and 1 hour before events
            </p>
          </div>
          <Switch
            id="event-reminders"
            checked={preferences.eventReminders}
            onCheckedChange={() => handleToggle('eventReminders')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="event-updates">Event Updates</Label>
            <p className="text-sm text-muted-foreground">
              Notified when event details change
            </p>
          </div>
          <Switch
            id="event-updates"
            checked={preferences.eventUpdates}
            onCheckedChange={() => handleToggle('eventUpdates')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="approval-status">Approval Status</Label>
            <p className="text-sm text-muted-foreground">
              Updates on registration approvals or rejections
            </p>
          </div>
          <Switch
            id="approval-status"
            checked={preferences.approvalStatus}
            onCheckedChange={() => handleToggle('approvalStatus')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="new-registrations">New Registrations (Event Owners)</Label>
            <p className="text-sm text-muted-foreground">
              Notified when someone registers for your events
            </p>
          </div>
          <Switch
            id="new-registrations"
            checked={preferences.newRegistrations}
            onCheckedChange={() => handleToggle('newRegistrations')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="event-cancellations">Event Cancellations</Label>
            <p className="text-sm text-muted-foreground">
              Notified when an event is cancelled
            </p>
          </div>
          <Switch
            id="event-cancellations"
            checked={preferences.eventCancellations}
            onCheckedChange={() => handleToggle('eventCancellations')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="marketing">Marketing Emails</Label>
            <p className="text-sm text-muted-foreground">
              Receive tips, news, and updates about the platform
            </p>
          </div>
          <Switch
            id="marketing"
            checked={preferences.marketing}
            onCheckedChange={() => handleToggle('marketing')}
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  )
}
