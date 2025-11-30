'use client'

import Link from 'next/link'
import { ArrowRight, Calendar, Users, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6a11cb] via-[#2575fc] to-[#4facfe] opacity-10" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 -z-10">
        <motion.div 
          className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-[#6a11cb] to-[#2575fc] opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-[#2575fc] to-[#4facfe] opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.25, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border bg-background px-4 py-1.5 text-sm"
          >
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Trusted by thousands of event organizers</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Create Amazing Events,{' '}
            <span className="bg-gradient-to-r from-[#6a11cb] via-[#2575fc] to-[#4facfe] bg-clip-text text-transparent">
              Connect People
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            The ultimate platform for creating, managing, and discovering events. 
            From small meetups to large conferences, we've got you covered.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/find-events">
                Browse Events
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-center">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-sm text-muted-foreground">Events Created</div>
            </motion.div>
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </motion.div>
            <motion.div 
              className="space-y-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold">98%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
