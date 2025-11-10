import { TimeUnit } from './TimeUnit'
import { useCountdown } from '@/hooks/useCountdown'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface CountdownProps {
  targetDate?: Date | string | number
  onComplete?: () => void
}

export function Countdown({ targetDate, onComplete }: CountdownProps) {
  const countdown = useCountdown({ targetDate, onComplete })
  const prefersReducedMotion = usePrefersReducedMotion()

  if (countdown.state === 'POST') {
    return (
      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h2 className="text-4xl md:text-6xl font-display font-bold gradient-text mb-4">
          We Are Live! 🎉
        </h2>
        <p className="text-muted-foreground text-lg">
          Welcome to the new year!
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto">
        <TimeUnit value={countdown.days} label="Days" />
        <TimeUnit value={countdown.hours} label="Hours" />
        <TimeUnit value={countdown.minutes} label="Minutes" />
        <TimeUnit value={countdown.seconds} label="Seconds" />
      </div>
    </motion.div>
  )
}
