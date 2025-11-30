'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Routes that should NOT show the public navbar/footer
  const isDashboardRoute = pathname.startsWith('/dashboard') ||
                          pathname.startsWith('/profile') ||
                          pathname.startsWith('/settings') ||
                          pathname.startsWith('/my-events') ||
                          pathname.startsWith('/my-registrations')

  if (isDashboardRoute) {
    // Dashboard routes have their own layout
    return <>{children}</>
  }

  // Public routes get navbar and footer
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
