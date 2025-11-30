'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { usePageTransition } from '@/hooks/use-page-transition'

export function PageTransition() {
  const pathname = usePathname()
  const { isTransitioning, endTransition } = usePageTransition()
  const [isPageReady, setIsPageReady] = useState(false)

  useEffect(() => {
    // When pathname changes, mark page as not ready
    setIsPageReady(false)
    
    // Wait for page to be fully loaded
    const checkPageReady = () => {
      // Wait for next tick to ensure DOM is updated
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsPageReady(true)
        })
      })
    }
    
    // Small delay to ensure content is rendered
    const timer = setTimeout(checkPageReady, 100)
    
    return () => clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    // End transition only when page is ready
    if (isTransitioning && isPageReady) {
      const timer = setTimeout(() => {
        endTransition()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isTransitioning, isPageReady, endTransition])

  // Show overlay if transitioning OR if page is not ready yet
  const showOverlay = isTransitioning || !isPageReady

  return (
    <AnimatePresence mode="wait">
      {showOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-md"
          style={{ pointerEvents: 'all' }}
        >
          {/* Animated Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col items-center gap-4"
          >
            {/* Logo with gradient */}
            <div className="relative">
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-primary/40 blur-xl"
              />
              <div className="relative bg-gradient-to-br from-primary to-primary/70 p-4 rounded-2xl shadow-2xl">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Loading text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <span className="text-sm font-medium text-muted-foreground">
                Loading
              </span>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="flex gap-1"
              >
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Top progress bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/70 to-primary origin-left"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
