import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { profileUpdateSchema } from '@/lib/validations/profile'

// GET /api/profile - Get current user profile with stats
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch user profile with stats
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        profileImageUrl: true,
        bio: true,
        location: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get counts separately
    const eventsCount = await prisma.event.count({
      where: { ownerId: session.user.id },
    })

    const registrationsCount = await prisma.registration.count({
      where: { userId: session.user.id },
    })

    // Get upcoming events count
    const upcomingEvents = await prisma.event.count({
      where: {
        ownerId: session.user.id,
        startDatetime: {
          gte: new Date(),
        },
        status: 'published',
      },
    })

    // Get recent activity
    const recentEvents = await prisma.event.findMany({
      where: { ownerId: session.user.id },
      select: {
        id: true,
        title: true,
        createdAt: true,
        status: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    })

    const recentRegistrations = await prisma.registration.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        registeredAt: true,
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { registeredAt: 'desc' },
      take: 3,
    })

    // Combine and sort recent activity
    const recentActivity = [
      ...recentEvents.map(event => ({
        type: 'event_created' as const,
        id: event.id,
        title: event.title,
        date: event.createdAt,
        status: event.status,
      })),
      ...recentRegistrations.map(reg => ({
        type: 'registration' as const,
        id: reg.id,
        title: reg.event.title,
        eventId: reg.event.id,
        date: reg.registeredAt,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)

    return NextResponse.json({
      ...user,
      stats: {
        eventsCreated: eventsCount,
        totalRegistrations: registrationsCount,
        upcomingEvents,
      },
      recentActivity,
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT /api/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = profileUpdateSchema.parse(body)

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.name,
        bio: validatedData.bio,
        location: validatedData.location,
        profileImageUrl: validatedData.profileImageUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImageUrl: true,
        bio: true,
        location: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
