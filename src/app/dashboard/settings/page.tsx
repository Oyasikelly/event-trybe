import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NotificationPreferences } from '@/components/settings/NotificationPreferences'
import { PasswordChangeForm } from '@/components/settings/PasswordChangeForm'
import { PrivacySettings } from '@/components/settings/PrivacySettings'
import { DataExport } from '@/components/settings/DataExport'
import { DangerZone } from '@/components/settings/DangerZone'

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/settings')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      emailVerified: true,
      createdAt: true,
      profileVisibility: true,
      showProfilePhoto: true,
      showBio: true,
      showLocation: true,
      showEventHistory: true,
      emailNotifications: true,
    },
  })

  if (!user) {
    redirect('/login')
  }

  // Parse email notifications JSON
  const emailNotifications = user.emailNotifications as any

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            View your account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Email Address</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            {user.emailVerified ? (
              <Badge variant="default" className="bg-green-600">Verified</Badge>
            ) : (
              <Badge variant="destructive">Not Verified</Badge>
            )}
          </div>

          <div>
            <p className="text-sm font-medium">Account Created</p>
            <p className="text-sm text-muted-foreground">
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Password Management */}
      <PasswordChangeForm />

      {/* Notification Preferences */}
      <NotificationPreferences initialPreferences={emailNotifications} />

      {/* Privacy Settings */}
      <PrivacySettings
        initialSettings={{
          profileVisibility: user.profileVisibility as 'public' | 'private',
          showProfilePhoto: user.showProfilePhoto,
          showBio: user.showBio,
          showLocation: user.showLocation,
          showEventHistory: user.showEventHistory,
        }}
      />

      {/* Data Export */}
      <DataExport />

      {/* Danger Zone */}
      <DangerZone />
    </div>
  )
}
