import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'private']),
  showProfilePhoto: z.boolean(),
  showBio: z.boolean(),
  showLocation: z.boolean(),
  showEventHistory: z.boolean(),
})

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const settings = privacySettingsSchema.parse(body)

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: settings,
      select: {
        profileVisibility: true,
        showProfilePhoto: true,
        showBio: true,
        showLocation: true,
        showEventHistory: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 })
    }
    console.error('Error updating privacy settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
