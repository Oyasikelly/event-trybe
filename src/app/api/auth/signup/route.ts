import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signupSchema } from '@/lib/validations/auth'
import { generateVerificationToken, getVerificationTokenExpiry } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 10)

    // Generate verification token
    const verificationToken = generateVerificationToken()
    const verificationTokenExpires = getVerificationTokenExpiry()

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        passwordHash,
        verificationToken,
        verificationTokenExpires,
        emailVerified: false,
        isActive: true,
      },
    })

    // Send verification email
    try {
      await sendVerificationEmail(user.email, user.name, verificationToken)
      console.log('✅ Verification email sent to:', user.email)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't fail signup if email fails - user can request resend later
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully! Please check your email to verify your account.',
        userId: user.id,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Signup error:', error)

    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'An error occurred during signup. Please try again.' },
      { status: 500 }
    )
  }
}
