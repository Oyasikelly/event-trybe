'use client'

import { ReactNode } from 'react'
import { useSidebar } from '@/hooks/use-sidebar'
import { cn } from '@/lib/utils'

export function DashboardLayoutClient({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <main
      className={cn(
        'pt-16 lg:pt-0 transition-all duration-300',
        isCollapsed ? 'lg:pl-[80px]' : 'lg:pl-[256px]'
      )}
    >
      <div className="container mx-auto p-6 lg:p-8">
        {children}
      </div>
    </main>
  )
}
