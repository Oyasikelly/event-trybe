'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PrivacySettings {
  profileVisibility: 'public' | 'private'
  showProfilePhoto: boolean
  showBio: boolean
  showLocation: boolean
  showEventHistory: boolean
}

interface PrivacySettingsProps {
  initialSettings: PrivacySettings
}

export function PrivacySettings({ initialSettings }: PrivacySettingsProps) {
  const { toast } = useToast()
  const [settings, setSettings] = useState<PrivacySettings>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = (key: keyof Omit<PrivacySettings, 'profileVisibility'>) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const response = await fetch('/api/settings/privacy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error('Failed to save settings')

      toast({
        title: 'Settings saved',
        description: 'Your privacy settings have been updated',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>
          Control what information is visible to others
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profile-visibility">Profile Visibility</Label>
          <Select
            value={settings.profileVisibility}
            onValueChange={(value: 'public' | 'private') =>
              setSettings((prev) => ({ ...prev, profileVisibility: value }))
            }
          >
            <SelectTrigger id="profile-visibility">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public - Anyone can view</SelectItem>
              <SelectItem value="private">Private - Only you can view</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="show-photo">Show Profile Photo</Label>
            <p className="text-sm text-muted-foreground">
              Display your profile photo to others
            </p>
          </div>
          <Switch
            id="show-photo"
            checked={settings.showProfilePhoto}
            onCheckedChange={() => handleToggle('showProfilePhoto')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="show-bio">Show Bio</Label>
            <p className="text-sm text-muted-foreground">
              Display your bio on your profile
            </p>
          </div>
          <Switch
            id="show-bio"
            checked={settings.showBio}
            onCheckedChange={() => handleToggle('showBio')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="show-location">Show Location</Label>
            <p className="text-sm text-muted-foreground">
              Display your location on your profile
            </p>
          </div>
          <Switch
            id="show-location"
            checked={settings.showLocation}
            onCheckedChange={() => handleToggle('showLocation')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="show-events">Show Event History</Label>
            <p className="text-sm text-muted-foreground">
              Display events you've created and attended
            </p>
          </div>
          <Switch
            id="show-events"
            checked={settings.showEventHistory}
            onCheckedChange={() => handleToggle('showEventHistory')}
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Settings
        </Button>
      </CardContent>
    </Card>
  )
}
