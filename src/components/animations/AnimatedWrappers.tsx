'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedEventCardProps {
  children: ReactNode
  index: number
}

export function AnimatedEventCard({ children, index }: AnimatedEventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedSectionProps {
  children: ReactNode
}

export function AnimatedSection({ children }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  )
}
