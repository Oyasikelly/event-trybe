'use client'

import { create } from 'zustand'

interface TransitionStore {
  isTransitioning: boolean
  startTransition: () => void
  endTransition: () => void
}

export const usePageTransition = create<TransitionStore>((set) => ({
  isTransitioning: false,
  startTransition: () => set({ isTransitioning: true }),
  endTransition: () => set({ isTransitioning: false }),
}))
