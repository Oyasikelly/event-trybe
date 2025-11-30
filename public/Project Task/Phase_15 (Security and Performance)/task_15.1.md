### Task 15.1: Implement Rate Limiting
**Description**: Add rate limiting to protect API endpoints from abuse.

**Implementation Steps**:
- Install Upstash Rate Limit: `npm install @upstash/ratelimit @upstash/redis`
- Configure Upstash Redis:
  - Create Upstash account
  - Create Redis database
  - Get REST URL and token
- Create `lib/rate-limit/rate-limiter.ts`:
  - Configure rate limit rules per endpoint
  - IP-based rate limiting
  - User-based rate limiting (authenticated)
  - Custom error responses
- Create middleware `middleware.ts`:
  - Apply rate limiting to API routes
  - Different limits for different endpoints
  - Return 429 status when exceeded
- Define rate limit rules:
  - Authentication endpoints: 5 requests per 15 minutes
  - Event creation: 10 per hour
  - Registration: 20 per hour
  - General API: 100 per minute
  - Email sending: 20 per hour

**Rate Limiter Configuration**:
```typescript
// lib/rate-limit/rate-limiter.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export const rateLimiters = {
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    analytics: true,
    prefix: 'ratelimit:auth'
  }),
  
  eventCreation: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    analytics: true,
    prefix: 'ratelimit:event'
  }),
  
  registration: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 h'),
    analytics: true,
    prefix: 'ratelimit:registration'
  }),
  
  general: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
    prefix: 'ratelimit:api'
  })
}

export async function checkRateLimit(
  identifier: string,
  type: keyof typeof rateLimiters
) {
  const ratelimit = rateLimiters[type]
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier)
  
  return {
    success,
    limit,
    reset,
    remaining
  }
}
```

**Middleware Implementation**:
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkRateLimit } from './lib/rate-limit/rate-limiter'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Determine rate limit type based on path
  let limitType: 'auth' | 'eventCreation' | 'registration' | 'general' = 'general'
  
  if (pathname.startsWith('/api/v1/auth')) {
    limitType = 'auth'
  } else if (pathname.startsWith('/api/v1/events') && request.method === 'POST') {
    limitType = 'eventCreation'
  } else if (pathname.startsWith('/api/v1/registrations')) {
    limitType = 'registration'
  }
  
  // Get identifier (IP or user ID)
  const identifier = request.ip ?? 'anonymous'
  
  const { success, limit, reset, remaining } = await checkRateLimit(
    identifier,
    limitType
  )
  
  if (!success) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        limit,
        reset,
        remaining: 0
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': reset.toString()
        }
      }
    )
  }
  
  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Limit', limit.toString())
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', reset.toString())
  
  return response
}

export const config = {
  matcher: '/api/:path*'
}
```

**Environment Variables**:
```env
UPSTASH_REDIS_REST_URL=https://your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

**Dependencies**: None (foundational security feature)

**Files to Create**:
- `lib/rate-limit/rate-limiter.ts`
- `middleware.ts`

**Testing**:
- [ ] Rate limits enforced correctly
- [ ] 429 status returned when exceeded
- [ ] Headers include rate limit info
- [ ] Different limits for different endpoints
- [ ] IP-based limiting works
- [ ] User-based limiting works (authenticated)
- [ ] Analytics tracking enabled
