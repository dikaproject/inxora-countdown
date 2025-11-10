import { motion } from 'framer-motion'
import { useState } from 'react'
import { CustomCursor } from './components/CustomCursor'
import { Countdown } from './components/Countdown'
import { EmailModal } from './components/EmailModal'
import { PreLoader } from './components/PreLoader'
import { AnimatedTitle } from './components/AnimatedTitle'
import { Badge } from './components/ui/Badge'
import { Mail, Rocket } from 'lucide-react'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { useLenis } from './hooks/useLenis'

function App() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const showCursor = import.meta.env.VITE_SHOW_CURSOR !== 'false'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize Lenis smooth scrolling
  useLenis()

  return (
    <>
      {/* Pre Loader */}
      <PreLoader onComplete={() => setIsLoading(false)} />

      {/* Email Notification Modal */}
      <EmailModal open={isModalOpen} onOpenChange={setIsModalOpen} />

      {/* Blob Custom Cursor */}
      {showCursor && !isLoading && (
        <CustomCursor 
          size={32} 
          blur={0}
          hideDefaultCursor={true}
        />
      )}
      
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Background gradient effects */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 md:py-16">
          <div className="flex flex-col items-center justify-center min-h-[90vh] gap-12 md:gap-16">
            
            {/* Header */}
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6"
            >
              <div className="flex justify-center">
                <Badge variant="outline" className="px-4 py-2 text-sm">
                  <Rocket className="w-4 h-4 mr-2" />
                  Launching Soon
                </Badge>
              </div>
              
              <AnimatedTitle />
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                Something extraordinary is coming. Join us as we count down to a new creative experience.
              </p>
            </motion.div>

            {/* Countdown */}
            <div className="w-full max-w-6xl">
              <Countdown />
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => setIsModalOpen(true)}
                className="
                  group relative px-8 py-4 rounded-xl font-semibold text-lg
                  bg-white text-black
                  hover:bg-white/90 active:scale-[0.98]
                  transition-all duration-200
                  flex items-center justify-center gap-3
                  shadow-lg shadow-white/20
                  border-2 border-white/20
                "
              >
                <Mail className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>Notify Me</span>
              </button>
            </motion.div>

            {/* Footer Info */}
            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center text-sm text-muted-foreground mt-auto pt-8"
            >
              <p>Launching at midnight, January 1st in your timezone</p>
            </motion.div>

          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p>&copy; 2025 Inxora Studio. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default App
