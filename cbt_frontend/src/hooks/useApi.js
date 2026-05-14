import { useState, useCallback } from 'react'

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const call = useCallback(async (apiFn, ...args) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFn(...args)
      return res.data
    } catch (err) {
      const msg = err.response?.data?.detail || 'Something went wrong'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, call }
}
