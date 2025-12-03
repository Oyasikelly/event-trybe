'use client'

import { format } from 'date-fns'
import { Calendar, Plus, Ticket, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TransitionLink } from '@/components/ui/transition-link'

interface Activity {
  type: 'event_created' | 'registration'
  id: string
  title: string
  date: string | Date
  status?: string
  eventId?: string
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No recent activity</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={`${activity.type}-${activity.id}`}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="mt-1">
                {activity.type === 'event_created' ? (
                  <div className="p-2 rounded-full bg-blue-500/10">
                    <Plus className="h-4 w-4 text-blue-500" />
                  </div>
                ) : (
                  <div className="p-2 rounded-full bg-purple-500/10">
                    <Ticket className="h-4 w-4 text-purple-500" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activity.type === 'event_created'
                        ? 'Created event'
                        : 'Registered for event'}
                    </p>
                    <TransitionLink
                      href={
                        activity.type === 'event_created'
                          ? `/dashboard/events/${activity.id}`
                          : `/dashboard/events/${activity.eventId}`
                      }
                      className="text-sm text-primary hover:underline line-clamp-1"
                    >
                      {activity.title}
                    </TransitionLink>
                  </div>

                  {activity.type === 'event_created' && activity.status && (
                    <Badge variant={activity.status === 'published' ? 'default' : 'secondary'}>
                      {activity.status}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(activity.date), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
