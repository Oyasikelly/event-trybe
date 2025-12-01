import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma, Prisma } from '@/lib/prisma'
import { eventSchema } from '@/lib/validations/event'
import { generateUniqueSlug } from '@/lib/utils/event-utils'

// GET /api/events - List all published events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    const where: any = {
      status: 'published',
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImageUrl: true,
            },
          },
          _count: {
            select: {
              registrations: true,
            },
          },
        },
        orderBy: {
          startDatetime: 'asc',
        },
        skip,
        take: limit,
      }),
      prisma.event.count({ where }),
    ])

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate request body
    const validatedData = eventSchema.parse(body)

    // Generate unique slug
    const slug = generateUniqueSlug(validatedData.title)

    // Create event
    const eventData: Prisma.EventUncheckedCreateInput = {
      title: validatedData.title,
      slug,
      description: validatedData.description,
      category: validatedData.category,
      eventType: validatedData.eventType,
      locationType: validatedData.locationType,
      locationVenue: validatedData.locationVenue,
      locationAddress: validatedData.locationAddress,
      locationCity: validatedData.locationCity,
      locationState: validatedData.locationState,
      locationCountry: validatedData.locationCountry,
      locationVirtualLink: validatedData.locationVirtualLink,
      startDatetime: new Date(validatedData.startDatetime),
      endDatetime: new Date(validatedData.endDatetime),
      timezone: validatedData.timezone,
      approvalMode: validatedData.approvalMode,
      capacityLimit: validatedData.capacityLimit,
      registrationDeadline: validatedData.registrationDeadline 
        ? new Date(validatedData.registrationDeadline)
        : null,
      isFree: validatedData.isFree,
      price: validatedData.price,
      currency: validatedData.currency,
      tags: validatedData.tags || [],
      requirements: validatedData.requirements,
      bannerImageUrl: validatedData.bannerImageUrl,
      liveEventUrl: validatedData.liveEventUrl,
      status: validatedData.status as any,
      publishedAt: validatedData.status === 'published' ? new Date() : null,
      ownerId: session.user.id,
    }

    const event = await prisma.event.create({
      data: eventData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          },
        },
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid event data', details: error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
