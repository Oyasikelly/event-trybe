import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch all registrations for the current user
    const registrations = await prisma.registration.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            startDatetime: true,
            endDatetime: true,
            locationType: true,
            locationAddress: true,
            locationCity: true,
            locationState: true,
            liveEventUrl: true,
            bannerImageUrl: true,
            category: true,
            isFree: true,
            price: true,
            currency: true,
          },
        },
      },
      orderBy: {
        registeredAt: 'desc',
      },
    })

    return NextResponse.json(registrations)
  } catch (error) {
    console.error('Error fetching user registrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}
