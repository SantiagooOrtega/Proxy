import { useState, useCallback } from 'react'
import { getQuotaStatus, getHistory } from '../services/api'

export function useQuota(userId) {
  const [quota, setQuota] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      const [quotaData, historyData] = await Promise.all([
        getQuotaStatus(userId),
        getHistory(userId),
      ])
      setQuota(quotaData)
      setHistory(historyData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userId])

  return { quota, history, loading, error, refresh }
}
