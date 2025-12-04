import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const notificationPreferencesSchema = z.object({
  registrationConfirmation: z.boolean(),
  eventReminders: z.boolean(),
  eventUpdates: z.boolean(),
  approvalStatus: z.boolean(),
  newRegistrations: z.boolean(),
  eventCancellations: z.boolean(),
  marketing: z.boolean(),
})

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const preferences = notificationPreferencesSchema.parse(body)

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        emailNotifications: preferences,
      },
      select: {
        emailNotifications: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }
    console.error('Error updating notification preferences:', error)
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 })
  }
}
