'use client'

import { motion } from 'framer-motion'
import { Users, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface AnalyticsGridProps {
  totalRegistrations: number
  confirmedRegistrations: number
  pendingRegistrations: number
  capacityUsed: number | null
  capacityLimit: number | null
}

export function AnalyticsGrid({
  totalRegistrations,
  confirmedRegistrations,
  pendingRegistrations,
  capacityUsed,
  capacityLimit,
}: AnalyticsGridProps) {
  const stats = [
    {
      label: 'Total Registrations',
      value: totalRegistrations,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Confirmed',
      value: confirmedRegistrations,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Pending Approval',
      value: pendingRegistrations,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      label: 'Capacity Used',
      value: capacityUsed !== null ? `${capacityUsed}%` : 'Unlimited',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      subtitle: capacityLimit ? `${totalRegistrations} / ${capacityLimit}` : null,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    {stat.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.subtitle}
                      </p>
                    )}
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
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
