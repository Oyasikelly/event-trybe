import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle,
  Plus,
  Search,
  List,
  UserCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

async function getUserStats(userId: string) {
  try {
    const [eventsCreated, totalRegistrations, upcomingEvents, pastEvents] = await Promise.all([
      // Events created by user
      prisma.event.count({
        where: { ownerId: userId },
      }),
      // Total registrations across user's events
      prisma.registration.count({
        where: {
          event: {
            ownerId: userId,
          },
        },
      }),
      // Upcoming events
      prisma.event.count({
        where: {
          ownerId: userId,
          startDatetime: {
            gte: new Date(),
          },
        },
      }),
      // Past events
      prisma.event.count({
        where: {
          ownerId: userId,
          startDatetime: {
            lt: new Date(),
          },
        },
      }),
    ])

    return {
      eventsCreated,
      totalRegistrations,
      upcomingEvents,
      pastEvents,
    }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return {
      eventsCreated: 0,
      totalRegistrations: 0,
      upcomingEvents: 0,
      pastEvents: 0,
    }
  }
}

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    return null
  }

  const stats = await getUserStats(session.user.id)

  const statsCards = [
    {
      title: 'Events Created',
      value: stats.eventsCreated,
      icon: Calendar,
      description: 'Total events you\'ve created',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Registrations',
      value: stats.totalRegistrations,
      icon: Users,
      description: 'Across all your events',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: Clock,
      description: 'Events happening soon',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Past Events',
      value: stats.pastEvents,
      icon: CheckCircle,
      description: 'Successfully completed',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  const quickActions = [
    {
      title: 'Create Event',
      description: 'Start organizing a new event',
      icon: Plus,
      href: '/events/create',
      variant: 'default' as const,
    },
    {
      title: 'Browse Events',
      description: 'Discover events to attend',
      icon: Search,
      href: '/find-events',
      variant: 'outline' as const,
    },
    {
      title: 'My Events',
      description: 'Manage your events',
      icon: List,
      href: '/my-events',
      variant: 'outline' as const,
    },
    {
      title: 'My Registrations',
      description: 'View events you\'re attending',
      icon: UserCheck,
      href: '/my-registrations',
      variant: 'outline' as const,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session.user.name?.split(' ')[0] || 'there'}! 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your events today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className={`p-3 rounded-lg w-fit mb-2 ${
                      action.variant === 'default' 
                        ? 'bg-gradient-to-br from-primary to-primary/70' 
                        : 'bg-accent'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        action.variant === 'default' 
                          ? 'text-white' 
                          : 'text-primary'
                      }`} />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {action.title}
                    </CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Getting Started */}
      {stats.eventsCreated === 0 && (
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle>🚀 Get Started with EventTrybe</CardTitle>
            <CardDescription>
              Create your first event and start connecting with your audience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg">
              <Link href="/events/create">
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Event
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
