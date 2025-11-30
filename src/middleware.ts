export { auth as middleware } from '@/lib/auth'

export const config = {
  matcher: [
    '/events/create',
    '/events/:id/edit',
    '/my-events',
    '/my-registrations',
    '/profile',
    '/settings',
  ],
}
