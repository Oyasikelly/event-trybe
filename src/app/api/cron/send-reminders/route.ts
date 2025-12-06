import { NextRequest, NextResponse } from 'next/server'
import { sendEventReminders } from '@/lib/email/services/reminder-service'

/**
 * Cron job endpoint to send event reminders
 * This will be called by Vercel Cron Jobs every hour
 * 
 * Security: Vercel Cron Jobs automatically include an authorization header
 */
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization')
    
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error('❌ Unauthorized cron request')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🕐 Starting event reminder cron job...')

    // Send 24-hour reminders
    const results24h = await sendEventReminders(24)
    console.log('24h reminders:', results24h)

    // Send 1-hour reminders
    const results1h = await sendEventReminders(1)
    console.log('1h reminders:', results1h)

    const totalSent = results24h.sentCount + results1h.sentCount
    const totalErrors = results24h.errorCount + results1h.errorCount

    console.log(`✅ Cron job completed: ${totalSent} sent, ${totalErrors} errors`)

    return NextResponse.json({
      success: true,
      message: 'Event reminders processed successfully',
      results: {
        reminders24h: results24h,
        reminders1h: results1h,
        totalSent,
        totalErrors,
      },
    })
  } catch (error) {
    console.error('❌ Error in reminder cron job:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process event reminders',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Allow POST as well for manual testing
export async function POST(request: NextRequest) {
  return GET(request)
}
