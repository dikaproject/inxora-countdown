import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface CustomCursorProps {
  size?: number
  blur?: number
  hideDefaultCursor?: boolean
}

export function CustomCursor({
  size = 32,
  blur = 0,
  hideDefaultCursor = true,
}: CustomCursorProps) {
  // Initialize cursor position at center of viewport to prevent blink from top-left
  const cursorX = useMotionValue(
    typeof window !== 'undefined' ? window.innerWidth / 2 - size / 2 : 0
  )
  const cursorY = useMotionValue(
    typeof window !== 'undefined' ? window.innerHeight / 2 - size / 2 : 0
  )
  const cursorScale = useMotionValue(1)
  const cursorOpacity = useMotionValue(1)

  // Lighter spring config for smoother, less resource-intensive animation
  const springConfig = { damping: 30, stiffness: 400, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)
  const scaleSpring = useSpring(cursorScale, { damping: 20, stiffness: 300, mass: 0.5 })
  const opacitySpring = useSpring(cursorOpacity, { damping: 20, stiffness: 200 })

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - size / 2)
      cursorY.set(e.clientY - size / 2)
    }

    const handleMouseDown = () => cursorScale.set(0.85)
    const handleMouseUp = () => cursorScale.set(1)
    const handleMouseEnter = () => cursorScale.set(1.2)
    const handleMouseLeave = () => cursorScale.set(1)

    // Fade out cursor when mouse leaves the window
    const handleMouseEnterWindow = () => cursorOpacity.set(1)
    const handleMouseLeaveWindow = () => cursorOpacity.set(0)

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseenter', handleMouseEnterWindow)
    document.addEventListener('mouseleave', handleMouseLeaveWindow)

    // Add scale on interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, textarea')
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    // Hide default cursor if enabled
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none'
    }

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseenter', handleMouseEnterWindow)
      document.removeEventListener('mouseleave', handleMouseLeaveWindow)
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
      if (hideDefaultCursor) {
        document.body.style.cursor = 'auto'
      }
    }
  }, [size, hideDefaultCursor, cursorX, cursorY, cursorScale, cursorOpacity])

  // Don't render on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null
  }

  return (
    <motion.div
      className="custom-cursor"
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
        scale: scaleSpring,
        opacity: opacitySpring,
        width: size,
        height: size,
        borderRadius: '50%',
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'difference',
        backgroundColor: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: `blur(${blur}px)`,
        willChange: 'transform',
      }}
    />
  )
}
