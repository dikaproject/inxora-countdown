import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Custom hook to initialize and manage Lenis smooth scrolling
 * 
 * Features:
 * - Smooth scrolling with customizable settings
 * - Auto-cleanup on unmount
 * - RAF (RequestAnimationFrame) integration
 * - Touch support for mobile devices
 */
export function useLenis() {
  useEffect(() => {
    // Initialize Lenis with custom options
    const lenis = new Lenis({
      duration: 1.2,           // Scroll duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      orientation: 'vertical', // Scroll orientation
      gestureOrientation: 'vertical', // Gesture orientation
      smoothWheel: true,       // Enable smooth wheel scrolling
      wheelMultiplier: 1,      // Wheel sensitivity
      touchMultiplier: 2,      // Touch sensitivity
      infinite: false,         // Disable infinite scroll
    })

    // Request Animation Frame loop
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Cleanup on unmount
    return () => {
      lenis.destroy()
    }
  }, [])
}
