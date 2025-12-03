import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: registrationId } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify the registration belongs to the current user
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      select: { userId: true, eventId: true },
    })

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }

    if (registration.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden - You do not own this registration' },
        { status: 403 }
      )
    }

    // Update registration status to cancelled
    await prisma.registration.update({
      where: { id: registrationId },
      data: {
        registrationStatus: 'cancelled',
        cancelledAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error cancelling registration:', error)
    return NextResponse.json(
      { error: 'Failed to cancel registration' },
      { status: 500 }
    )
  }
}
