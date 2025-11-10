import { motion, AnimatePresence } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Mail, CheckCircle2, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { subscribeEmail } from '@/services/emailService'

const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

type EmailFormData = z.infer<typeof emailSchema>

interface EmailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmailModal({ open, onOpenChange }: EmailModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  })

  const onSubmit = async (data: EmailFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const result = await subscribeEmail(data.email)
      
      if (result.success) {
        setSubmitStatus('success')
        reset()
        
        // Auto close modal after 2 seconds
        setTimeout(() => {
          onOpenChange(false)
          setSubmitStatus('idle')
        }, 2000)
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.message || 'Failed to subscribe. Please try again.')
      }
    } catch {
      setSubmitStatus('error')
      setErrorMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false)
      reset()
      setSubmitStatus('idle')
      setErrorMessage('')
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
        </Dialog.Overlay>

        <Dialog.Content asChild>
          <div className="fixed left-[50%] top-[50%] z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full"
            >
            <div className="bg-background border-2 border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              
              {/* Close button */}
              <Dialog.Close asChild>
                <button
                  className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
                  aria-label="Close"
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </Dialog.Close>

              <div className="relative">
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Title & Description */}
                <Dialog.Title className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-white text-center mb-3">
                  Get Notified
                </Dialog.Title>
                
                <Dialog.Description className="text-sm md:text-base text-white/70 text-center mb-6 md:mb-8">
                  Be the first to know when Inxora Studio launches. We'll send you a notification via email.
                </Dialog.Description>

                {/* Success Message */}
                <AnimatePresence mode="wait">
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 md:mb-6 p-3 md:p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-2 md:gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-green-400 font-medium text-xs md:text-sm">
                          Successfully subscribed!
                        </p>
                        <p className="text-green-400/70 text-[10px] md:text-xs mt-1">
                          We'll notify you when we launch.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 md:mb-6 p-3 md:p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2 md:gap-3"
                    >
                      <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-red-400 text-xs md:text-sm">{errorMessage}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        {...register('email')}
                        type="email"
                        id="email"
                        placeholder="Enter your email address"
                        disabled={isSubmitting}
                        className={`
                          w-full px-4 py-3.5 bg-white/5 border-2 rounded-xl
                          text-white placeholder:text-white/40 text-sm md:text-base
                          focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30
                          disabled:opacity-50 disabled:cursor-not-allowed
                          transition-all duration-200
                          ${errors.email ? 'border-red-500/50' : 'border-white/20'}
                        `}
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-xs md:text-sm mt-2 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                          {errors.email.message}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      w-full py-3 md:py-3.5 px-6 rounded-xl font-semibold text-sm md:text-base
                      bg-white text-black
                      hover:bg-white/90 active:scale-[0.98]
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-200
                      flex items-center justify-center gap-2
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Notify Me</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Privacy notice */}
                <p className="text-white/40 text-[10px] md:text-xs text-center mt-4 md:mt-6">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>
            </motion.div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
