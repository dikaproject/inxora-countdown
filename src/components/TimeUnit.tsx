import { motion, AnimatePresence } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface TimeUnitProps {
  value: number
  label: string
}

export function TimeUnit({ value, label }: TimeUnitProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  // Pad dengan 0 untuk nilai < 10
  const displayValue = value.toString().padStart(2, '0')
  const digits = displayValue.split('')

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-1 md:gap-2">
        {digits.map((digit, index) => (
          <div
            key={index}
            className="relative flex items-center justify-center overflow-hidden rounded-lg bg-card/50 backdrop-blur-sm border border-border/50"
            style={{
              width: 'clamp(40px, 12vw, 80px)',
              height: 'clamp(60px, 18vw, 120px)',
            }}
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={digit}
                initial={prefersReducedMotion ? undefined : { y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={prefersReducedMotion ? undefined : { y: 20, opacity: 0 }}
                transition={{
                  type: 'spring',
                  damping: 20,
                  stiffness: 300,
                }}
                className="font-mono text-countdown-sm md:text-countdown-md lg:text-countdown-lg font-bold gradient-text"
              >
                {digit}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
      </div>
      
      <span className="text-countdown-label text-muted-foreground font-medium uppercase">
        {label}
      </span>
    </div>
  )
}
