import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email/send-email'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: eventId } = await params
    const { subject, message, filters } = await request.json()

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      )
    }

    // Verify event ownership
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { ownerId: true, title: true },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (event.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Build filter conditions
    const whereConditions: any = {
      eventId,
    }

    if (filters?.status && filters.status !== 'all') {
      whereConditions.registrationStatus = filters.status
    }

    if (filters?.checkedIn === 'true') {
      whereConditions.checkedInAt = { not: null }
    } else if (filters?.checkedIn === 'false') {
      whereConditions.checkedInAt = null
    }

    // Fetch attendees
    const attendees = await prisma.registration.findMany({
      where: whereConditions,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Filter by search if provided
    let filteredAttendees = attendees
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filteredAttendees = attendees.filter(
        (a) =>
          a.user.name.toLowerCase().includes(searchLower) ||
          a.user.email.toLowerCase().includes(searchLower)
      )
    }

    if (filteredAttendees.length === 0) {
      return NextResponse.json(
        { error: 'No attendees match the selected filters' },
        { status: 400 }
      )
    }

    // Send emails in batches to avoid rate limits
    let sentCount = 0
    let errorCount = 0

    for (const attendee of filteredAttendees) {
      try {
        // Create personalized email HTML
        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">${event.title}</h1>
              </div>
              
              <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
                <p style="margin: 0 0 20px;">Hi ${attendee.user.name},</p>
                
                <div style="white-space: pre-wrap; margin: 20px 0;">${message}</div>
                
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                
                <p style="font-size: 13px; color: #999; margin: 0;">
                  This email was sent to attendees of ${event.title}.
                </p>
              </div>
            </body>
          </html>
        `

        await sendEmail({
          to: attendee.user.email,
          subject,
          html: emailHtml,
        })

        sentCount++
      } catch (error) {
        console.error(`Failed to send email to ${attendee.user.email}:`, error)
        errorCount++
      }
    }

    console.log(`✅ Bulk email sent: ${sentCount} successful, ${errorCount} failed`)

    return NextResponse.json({
      success: true,
      sentCount,
      errorCount,
      totalRecipients: filteredAttendees.length,
    })
  } catch (error) {
    console.error('Error sending bulk email:', error)
    return NextResponse.json(
      { error: 'Failed to send bulk email' },
      { status: 500 }
    )
  }
}
