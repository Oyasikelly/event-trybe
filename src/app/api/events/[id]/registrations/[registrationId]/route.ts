import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; registrationId: string }> }
) {
  try {
    const { id: eventId, registrationId } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify event ownership
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { ownerId: true, title: true },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    if (event.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden - You do not own this event' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action } = body // 'approve' or 'reject'

    // Update registration
    const registration = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        registrationStatus: action === 'approve' ? 'confirmed' : 'cancelled',
        approvalStatus: action === 'approve' ? 'accepted' : 'rejected',
        approvedAt: action === 'approve' ? new Date() : null,
        approvedById: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // TODO: Send email notification to user
    // This would be implemented in Phase 5 with email service

    return NextResponse.json({
      success: true,
      registration,
      message: `Registration ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
    })
  } catch (error) {
    console.error('Error updating registration:', error)
    return NextResponse.json(
      { error: 'Failed to update registration' },
      { status: 500 }
    )
  }
}
