import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile/ProfileForm'

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/profile')
  }

  // Fetch full user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      bio: true,
      location: true,
      profileImageUrl: true,
    },
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and preferences
        </p>
      </div>

      <ProfileForm
        user={{
          name: user.name,
          email: user.email,
          bio: user.bio,
          location: user.location,
          image: user.profileImageUrl,
        }}
      />
    </div>
  )
}
