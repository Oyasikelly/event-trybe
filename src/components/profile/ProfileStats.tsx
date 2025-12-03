'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, Ticket, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface ProfileStatsProps {
  eventsCreated: number
  totalRegistrations: number
  upcomingEvents: number
}

export function ProfileStats({
  eventsCreated,
  totalRegistrations,
  upcomingEvents,
}: ProfileStatsProps) {
  const stats = [
    {
      label: 'Events Created',
      value: eventsCreated,
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Total Registrations',
      value: totalRegistrations,
      icon: Ticket,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Upcoming Events',
      value: upcomingEvents,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
