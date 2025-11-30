import Link from 'next/link'
import { Calendar, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <Calendar className="h-24 w-24 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Event Not Found</h2>
        <p className="text-muted-foreground">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
