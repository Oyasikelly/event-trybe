'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useSidebar } from '@/hooks/use-sidebar'
import { cn } from '@/lib/utils'

interface DashboardNavProps {
  user: {
    name: string
    email: string
    image?: string | null
  }
}

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    label: 'My Events',
    href: '/my-events',
    icon: Calendar,
    badge: null,
  },
  {
    label: 'My Registrations',
    href: '/my-registrations',
    icon: Users,
    badge: null,
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
    badge: null,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    badge: null,
  },
]

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isCollapsed, toggle } = useSidebar()

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">EventTrybe</span>
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? '80px' : '256px',
        }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
        className={cn(
          'fixed top-0 left-0 z-40 h-screen bg-background border-r',
          'transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className="p-6 border-b flex items-center justify-between">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/dashboard" className="flex items-center space-x-2">
                    <Calendar className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl">EventTrybe</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {isCollapsed && (
              <Link href="/dashboard" className="mx-auto">
                <Calendar className="h-6 w-6 text-primary" />
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="hidden lg:flex ml-auto"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              const navLink = (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg',
                    'transition-all duration-200',
                    'hover:bg-accent hover:text-accent-foreground',
                    isActive && 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary font-medium',
                    isCollapsed && 'justify-center'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {item.badge && !isCollapsed && (
                    <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )

              if (isCollapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      {navLink}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return navLink
            })}
          </nav>

          {/* User Menu */}
          <div className="p-4 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  'flex items-center gap-3 w-full px-4 py-3 rounded-lg',
                  'hover:bg-accent transition-colors',
                  isCollapsed && 'justify-center'
                )}>
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={user.image || undefined} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 text-left overflow-hidden"
                      >
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}
