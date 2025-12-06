'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QRScanner } from '@/components/events/QRScanner'
import { useToast } from '@/hooks/use-toast'
import {
  CheckCircle2,
  XCircle,
  Users,
  UserCheck,
  UserX,
  ArrowLeft,
  Loader2,
  Clock,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CheckInStats {
  total: number
  checkedIn: number
  notCheckedIn: number
  percentage: number
}

interface RecentCheckIn {
  id: string
  ticketNumber: string
  name: string
  email: string
  profileImage: string | null
  checkedInAt: Date
}

interface ScanResult {
  success: boolean
  message: string
  attendee?: {
    name: string
    email: string
    ticketNumber: string
    profileImage?: string | null
    checkedInAt: Date
  }
  error?: string
}

export default function CheckInPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const eventId = params.id as string

  const [isScanning, setIsScanning] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [stats, setStats] = useState<CheckInStats | null>(null)
  const [recentCheckIns, setRecentCheckIns] = useState<RecentCheckIn[]>([])
  const [lastScanResult, setLastScanResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [eventId])

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/check-in`)
      if (!response.ok) throw new Error('Failed to fetch stats')

      const data = await response.json()
      setStats(data.statistics)
      setRecentCheckIns(data.recentCheckIns)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load check-in statistics',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleScan = async (qrData: string) => {
    if (isProcessing) return

    setIsProcessing(true)
    setLastScanResult(null)

    try {
      const response = await fetch(`/api/events/${eventId}/check-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData }),
      })

      const data = await response.json()

      if (response.ok) {
        setLastScanResult({
          success: true,
          message: data.message,
          attendee: data.attendee,
        })

        toast({
          title: 'Check-in Successful! ✓',
          description: `${data.attendee.name} has been checked in`,
        })

        // Refresh stats
        fetchStats()
      } else {
        setLastScanResult({
          success: false,
          message: data.error || 'Check-in failed',
          error: data.error,
        })

        toast({
          title: 'Check-in Failed',
          description: data.error || 'Invalid QR code',
          variant: 'destructive',
        })
      }
    } catch (error) {
      setLastScanResult({
        success: false,
        message: 'Network error',
        error: 'Failed to process check-in',
      })

      toast({
        title: 'Error',
        description: 'Failed to process check-in',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
      // Clear result after 5 seconds
      setTimeout(() => setLastScanResult(null), 5000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Event
        </Button>
        <h1 className="text-3xl font-bold mb-2">Event Check-in</h1>
        <p className="text-muted-foreground">
          Scan QR codes to check-in attendees
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
              </div>
              <Users className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Checked In</p>
                <p className="text-2xl font-bold text-green-600">{stats?.checkedIn || 0}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Not Checked In</p>
                <p className="text-2xl font-bold text-orange-600">{stats?.notCheckedIn || 0}</p>
              </div>
              <UserX className="h-8 w-8 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Attendance</p>
                <p className="text-2xl font-bold">{stats?.percentage || 0}%</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">QR Scanner</h2>
            <Button
              onClick={() => setIsScanning(!isScanning)}
              variant={isScanning ? 'destructive' : 'default'}
            >
              {isScanning ? 'Stop Scanning' : 'Start Scanning'}
            </Button>
          </div>

          {isScanning && (
            <QRScanner
              onScan={handleScan}
              isScanning={isScanning}
            />
          )}

          {/* Scan Result */}
          <AnimatePresence>
            {lastScanResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className={lastScanResult.success ? 'border-green-500' : 'border-red-500'}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      {lastScanResult.success ? (
                        <CheckCircle2 className="h-8 w-8 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-8 w-8 text-red-500 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-1 ${lastScanResult.success ? 'text-green-600' : 'text-red-600'}`}>
                          {lastScanResult.message}
                        </h3>
                        {lastScanResult.attendee && (
                          <div className="space-y-1 text-sm">
                            <p><strong>Name:</strong> {lastScanResult.attendee.name}</p>
                            <p><strong>Email:</strong> {lastScanResult.attendee.email}</p>
                            <p><strong>Ticket:</strong> {lastScanResult.attendee.ticketNumber}</p>
                            <p className="text-muted-foreground">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {new Date(lastScanResult.attendee.checkedInAt).toLocaleTimeString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {isProcessing && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Processing check-in...</span>
            </div>
          )}
        </div>

        {/* Recent Check-ins */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Check-ins</h2>
          <Card>
            <CardContent className="p-0">
              {recentCheckIns.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No check-ins yet</p>
                  <p className="text-sm">Start scanning QR codes to check-in attendees</p>
                </div>
              ) : (
                <div className="divide-y">
                  {recentCheckIns.map((checkIn) => (
                    <div key={checkIn.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        {checkIn.profileImage ? (
                          <img
                            src={checkIn.profileImage}
                            alt={checkIn.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold">
                              {checkIn.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{checkIn.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{checkIn.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs">
                            {checkIn.ticketNumber}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(checkIn.checkedInAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
