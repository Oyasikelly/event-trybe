'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ComponentProps, MouseEvent } from 'react'
import { usePageTransition } from '@/hooks/use-page-transition'

interface TransitionLinkProps extends ComponentProps<typeof Link> {
  href: string
}

export function TransitionLink({ href, onClick, children, ...props }: TransitionLinkProps) {
  const router = useRouter()
  const { startTransition } = usePageTransition()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Don't intercept if it's a new tab, external link, or has modifiers
    if (
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      e.altKey ||
      (e.target as HTMLAnchorElement).target === '_blank' ||
      href.startsWith('http')
    ) {
      return
    }

    e.preventDefault()
    
    // Call original onClick if provided
    onClick?.(e)
    
    // Start transition immediately
    startTransition()
    
    // Navigate after a tiny delay to ensure transition starts
    setTimeout(() => {
      router.push(href.toString())
    }, 10)
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
