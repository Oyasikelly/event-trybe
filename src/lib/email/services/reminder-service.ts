import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email/send-email'
import { generateEventReminderEmail } from '@/lib/email/templates/event-reminder'
import { formatEventDateTime, getEventLocation, getEventLink } from '@/lib/utils/event-reminders'

interface SendReminderParams {
  registrationId: string
  hoursUntil: 24 | 1
}

/**
 * Send event reminder email to a registered attendee
 */
export async function sendEventReminderEmail({
  registrationId,
  hoursUntil,
}: SendReminderParams) {
  try {
    // Get registration with event and user details
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        event: true,
        user: true,
      },
    })

    if (!registration) {
      throw new Error(`Registration ${registrationId} not found`)
    }

    const { event, user } = registration

    // Format event details
    const { date, time } = formatEventDateTime(event)
    const location = getEventLocation(event)
    const eventLink = getEventLink(event.id)

    // Generate email content
    const { subject, html } = generateEventReminderEmail({
      userName: user.name,
      eventTitle: event.title,
      eventDate: date,
      eventTime: time,
      eventLocation: location,
      eventLink,
      hoursUntil,
      qrCodeUrl: registration.qrCode || undefined,
    })

    // Send email
    await sendEmail({
      to: user.email,
      subject,
      html,
    })

    // Update reminder tracking flag
    const updateData = hoursUntil === 24 
      ? { reminderSent24h: true }
      : { reminderSent1h: true }

    await prisma.registration.update({
      where: { id: registrationId },
      data: updateData,
    })

    console.log(`✅ ${hoursUntil}h reminder sent to ${user.email} for event: ${event.title}`)

    return { success: true }
  } catch (error) {
    console.error(`❌ Failed to send reminder for registration ${registrationId}:`, error)
    throw error
  }
}

/**
 * Send reminders to all attendees who need them
 */
export async function sendEventReminders(hoursUntil: 24 | 1) {
  try {
    const now = new Date()
    const targetTime = new Date(now.getTime() + hoursUntil * 60 * 60 * 1000)

    // Calculate time window (±1 hour buffer)
    const startTime = new Date(targetTime.getTime() - 60 * 60 * 1000)
    const endTime = new Date(targetTime.getTime() + 60 * 60 * 1000)

    // Find events in the time window
    const events = await prisma.event.findMany({
      where: {
        status: 'published',
        startDatetime: {
          gte: startTime,
          lte: endTime,
        },
      },
      include: {
        registrations: {
          where: {
            registrationStatus: 'confirmed',
            ...(hoursUntil === 24 
              ? { reminderSent24h: false }
              : { reminderSent1h: false }
            ),
          },
          include: {
            user: true,
          },
        },
      },
    })

    console.log(`📧 Found ${events.length} events needing ${hoursUntil}h reminders`)

    let successCount = 0
    let errorCount = 0

    // Send reminders for each registration
    for (const event of events) {
      console.log(`Processing event: ${event.title} (${event.registrations.length} attendees)`)

      for (const registration of event.registrations) {
        try {
          await sendEventReminderEmail({
            registrationId: registration.id,
            hoursUntil,
          })
          successCount++
        } catch (error) {
          console.error(`Failed to send reminder to ${registration.user.email}:`, error)
          errorCount++
        }
      }
    }

    console.log(`✅ Sent ${successCount} reminders, ${errorCount} failed`)

    return {
      success: true,
      sentCount: successCount,
      errorCount,
      eventsProcessed: events.length,
    }
  } catch (error) {
    console.error('Error sending event reminders:', error)
    throw error
  }
}
