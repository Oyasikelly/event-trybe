import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Deactivate account (soft delete)
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        isActive: false,
        deactivatedAt: new Date(),
      },
    })

    return NextResponse.json({ message: 'Account deactivated successfully' })
  } catch (error) {
    console.error('Error deactivating account:', error)
    return NextResponse.json({ error: 'Failed to deactivate account' }, { status: 500 })
  }
}
