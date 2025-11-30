import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
    },
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-3xl space-y-6">
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
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Change your password or manage authentication methods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Password management features coming soon. For now, use the "Forgot Password" link on the login page to reset your password.
          </p>
        </CardContent>
      </Card>

      {/* Notifications (Placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Manage your email notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Notification preferences will be available in a future update.
          </p>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible account actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Account deletion features will be available in a future update. Please contact support if you need to delete your account.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
