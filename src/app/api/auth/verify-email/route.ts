import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isTokenExpired } from '@/lib/tokens'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Find user by verification token
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      )
    }

    // Check if token has expired
    if (isTokenExpired(user.verificationTokenExpires)) {
      return NextResponse.json(
        { error: 'Verification token has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'Email already verified. You can now log in.' },
        { status: 200 }
      )
    }

    // Update user to mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      },
    })

    console.log('✅ Email verified for:', user.email)

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully! You can now log in.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'An error occurred during verification. Please try again.' },
      { status: 500 }
    )
  }
}
