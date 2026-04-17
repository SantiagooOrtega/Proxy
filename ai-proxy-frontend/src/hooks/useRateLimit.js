import { useState, useEffect, useRef } from 'react'

export function useRateLimit(quota) {
  const [secondsLeft, setSecondsLeft] = useState(0)
  const intervalRef = useRef(null)

  const triggerCooldown = (seconds) => {
    setSecondsLeft(seconds)
  }

  useEffect(() => {
    if (secondsLeft <= 0) {
      clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [secondsLeft])

  const maxRequests = quota?.plan
    ? { FREE: 10, PRO: 60, ENTERPRISE: Infinity }[quota.plan] ?? 10
    : 10

  const used = quota?.requestsThisMinute ?? 0
  const isLimited = secondsLeft > 0

  return { used, maxRequests, secondsLeft, isLimited, triggerCooldown }
}
