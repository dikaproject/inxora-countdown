import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface PreLoaderProps {
  onComplete?: () => void
}

export function PreLoader({ onComplete }: PreLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingStage, setLoadingStage] = useState(0) // 0: logo, 1: text1, 2: text2, 3: fade out

  useEffect(() => {
    // Stage 0: Logo appears and stays (0-1000ms)
    const timer1 = setTimeout(() => setLoadingStage(1), 1000)
    
    // Stage 1: First text appears (1000-2200ms)
    const timer2 = setTimeout(() => setLoadingStage(2), 2800)
    
    // Stage 2: Second text appears (2200-3200ms)
    const timer3 = setTimeout(() => setLoadingStage(3), 4200)
    
    // Stage 3: Fade out and complete (3200-3800ms)
    const timer4 = setTimeout(() => {
      setIsLoading(false)
      onComplete?.()
    }, 4600)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [onComplete])

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ 
            duration: 0.9, 
            ease: [0.76, 0, 0.24, 1] // Smooth cubic-bezier for swipe
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          {/* Background gradient effects */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
            />
          </div>

          {/* Content Container - Centered */}
          <div className="relative flex items-center justify-center w-full px-6">
            <AnimatePresence mode="wait">
              
              {/* Stage 0: Logo Only */}
              {loadingStage === 0 && (
                <motion.div
                  key="logo"
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="flex justify-center"
                >
                  <img
                    src="/logo-nobg-text.png"
                    alt="Inxora Studio"
                    className="h-28 md:h-36 lg:h-40 w-auto object-contain"
                    draggable={false}
                  />
                </motion.div>
              )}

              {/* Stage 1: First Text */}
              {loadingStage === 1 && (
                <motion.div
                  key="text1"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="text-center max-w-3xl"
                >
                  <p className="text-white/85 text-2xl md:text-3xl lg:text-4xl font-light tracking-wide leading-relaxed">
                    Where creativity meets technology
                  </p>
                </motion.div>
              )}

              {/* Stage 2: Second Text */}
              {loadingStage === 2 && (
                <motion.div
                  key="text2"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="text-center flex flex-col items-center gap-6"
                >
                  <p className="text-white text-3xl md:text-4xl lg:text-5xl font-medium tracking-wide">
                    Almost There
                  </p>
                  
                  {/* Loading dots */}
                  <div className="flex justify-center gap-2.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-white/60"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: 'easeInOut'
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
