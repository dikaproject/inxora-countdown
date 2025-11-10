import { useState, useEffect, useCallback, useRef } from 'react'
import { differenceInSeconds, differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns'

export interface CountdownState {
  days: number
  hours: number
  minutes: number
  seconds: number
  isOver: boolean
  state: 'BEFORE' | 'LIVE' | 'POST'
}

interface UseCountdownOptions {
  targetDate?: Date | string | number
  onComplete?: () => void
}

export function useCountdown(options: UseCountdownOptions = {}): CountdownState {
  // Use ref to avoid recreating function on every render
  const onCompleteRef = useRef(options.onComplete)
  
  useEffect(() => {
    onCompleteRef.current = options.onComplete
  }, [options.onComplete])

  const getTargetDate = useCallback(() => {
    if (options.targetDate) {
      return new Date(options.targetDate)
    }
    
    // Default: 1 Januari tahun berikutnya pukul 00:00 waktu lokal
    const now = new Date()
    const nextYear = now.getFullYear() + 1
    return new Date(nextYear, 0, 1, 0, 0, 0, 0)
  }, [options.targetDate])

  const calculateTimeLeft = useCallback((): CountdownState => {
    const target = getTargetDate()
    const now = new Date()
    
    // Cek apakah sudah lewat
    if (now >= target) {
      if (onCompleteRef.current) {
        onCompleteRef.current()
      }
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isOver: true,
        state: 'POST'
      }
    }

    // Hitung selisih waktu
    const totalSeconds = differenceInSeconds(target, now)
    const days = differenceInDays(target, now)
    const hours = differenceInHours(target, now) % 24
    const minutes = differenceInMinutes(target, now) % 60
    const seconds = totalSeconds % 60

    // Jika kurang dari 1 menit, status LIVE
    const state = totalSeconds < 60 ? 'LIVE' : 'BEFORE'

    return {
      days,
      hours,
      minutes,
      seconds,
      isOver: false,
      state
    }
  }, [getTargetDate])

  const [timeLeft, setTimeLeft] = useState<CountdownState>(() => calculateTimeLeft())

  useEffect(() => {
    // Update setiap detik menggunakan setInterval yang stabil
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(interval)
  }, [calculateTimeLeft])

  return timeLeft
}
