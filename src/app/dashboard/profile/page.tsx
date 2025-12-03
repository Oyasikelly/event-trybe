'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, MapPin, Mail, Calendar, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { ProfileStats } from '@/components/profile/ProfileStats'
import { RecentActivity } from '@/components/profile/RecentActivity'
import { EditProfileModal } from '@/components/profile/EditProfileModal'
import { format } from 'date-fns'

interface ProfileData {
  id: string
  name: string
  email: string
  profileImageUrl?: string | null
  bio?: string | null
  location?: string | null
  createdAt: string
  stats: {
    eventsCreated: number
    totalRegistrations: number
    upcomingEvents: number
  }
  recentActivity: Array<{
    type: 'event_created' | 'registration'
    id: string
    title: string
    date: string
    status?: string
    eventId?: string
  }>
}

export default function ProfilePage() {
  const { toast } = useToast()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/profile')

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()
      setProfile(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground">
            Unable to load your profile. Please try again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section with Cover */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden mb-6">
          {/* Cover Photo - Gradient Background */}
          {/* <div className="h-8 bg-gradient-to-r from-primary via-primary/80 to-primary/60" /> */}

          <CardContent className="relative pt-15  pb-6">
            {/* Profile Picture - Overlapping Cover */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                  <AvatarImage src={profile.profileImageUrl || undefined} alt={profile.name} />
                  <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-primary/60 text-white">
                    {profile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="md:mb-2">
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {profile.email}
                    </div>
                    {profile.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {profile.location}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Joined {format(new Date(profile.createdAt), 'MMMM yyyy')}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setEditModalOpen(true)}
                className="md:mb-2"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {profile.bio}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <ProfileStats
          eventsCreated={profile.stats.eventsCreated}
          totalRegistrations={profile.stats.totalRegistrations}
          upcomingEvents={profile.stats.upcomingEvents}
        />
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <RecentActivity activities={profile.recentActivity} />
      </motion.div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        currentData={{
          name: profile.name,
          email: profile.email,
          bio: profile.bio,
          location: profile.location,
          profileImageUrl: profile.profileImageUrl,
        }}
        onSuccess={fetchProfile}
      />
    </div>
  )
}
