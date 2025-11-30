import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import type { User } from '@prisma/client'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) {
          throw new Error('Invalid email or password')
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isValidPassword) {
          throw new Error('Invalid email or password')
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error('Please verify your email before logging in')
        }

        // Check if account is active
        if (!user.isActive) {
          throw new Error('Your account has been deactivated')
        }

        // Return user object (password excluded)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.profileImageUrl,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign in
      if (account?.provider === 'google') {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (existingUser) {
            // Update profile image if changed
            if (user.image && user.image !== existingUser.profileImageUrl) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { profileImageUrl: user.image },
              })
            }
          } else {
            // Create new user from Google account
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || '',
                profileImageUrl: user.image,
                emailVerified: true, // Google accounts are pre-verified
                passwordHash: '', // No password for OAuth users
                isActive: true,
              },
            })
          }
        } catch (error) {
          console.error('Error during Google sign in:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      // Add user ID to token on sign in
      if (user) {
        token.id = user.id
      }
      // Store OAuth provider info
      if (account) {
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      // Add user ID to session
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
})

