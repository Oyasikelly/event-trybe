import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { DashboardNav } from '@/components/dashboard/DashboardNav'
import { DashboardLayoutClient } from '@/components/dashboard/DashboardLayoutClient'

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav
        user={{
          name: session.user.name || 'User',
          email: session.user.email || '',
          image: session.user.image,
        }}
      />
      
      <DashboardLayoutClient>
        {children}
      </DashboardLayoutClient>
    </div>
  )
}
