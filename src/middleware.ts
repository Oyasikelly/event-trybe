import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

// Define route patterns
const publicRoutes = [
  '/',
  '/find-events',
  '/events/:id',
  '/showcase/:slug',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
]

const authRoutes = [
  '/login',
  '/signup',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
]

const protectedRoutes = [
  '/dashboard',
  '/events/create',
  '/events/:id/edit',
  '/my-events',
  '/my-registrations',
  '/profile',
  '/settings',
]

/**
 * Check if a path matches a route pattern
 * Supports dynamic segments like :id
 */
function matchesPattern(path: string, pattern: string): boolean {
  // Exact match
  if (path === pattern) return true
  
  // Convert pattern to regex (e.g., /events/:id -> /events/[^/]+)
  const regexPattern = pattern
    .replace(/:[^/]+/g, '[^/]+')
    .replace(/\//g, '\\/')
  
  const regex = new RegExp(`^${regexPattern}$`)
  return regex.test(path)
}

/**
 * Check if path matches any pattern in array
 */
function matchesAnyPattern(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => matchesPattern(path, pattern))
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files, API routes (except auth), and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') && !pathname.startsWith('/api/auth') ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next()
  }

  // Get session
  const session = await auth()
  const isAuthenticated = !!session?.user

  // Handle auth routes (login, signup, etc.)
  if (matchesAnyPattern(pathname, authRoutes)) {
    if (isAuthenticated) {
      // Redirect authenticated users away from auth pages
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Handle protected routes
  if (matchesAnyPattern(pathname, protectedRoutes)) {
    if (!isAuthenticated) {
      // Redirect to login with callback URL
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Public routes - allow everyone
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
