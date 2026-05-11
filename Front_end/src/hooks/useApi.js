import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

export function useApi(url = null) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // GET automatique si URL fournie
  useEffect(() => {
    if (!url) return
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get(url)
        setData(res.data)
      } catch (e) {
        setError(e.response?.data?.detail || e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [url])

  // PATCH manuel
  const patch = useCallback(async (patchUrl, body) => {
    setLoading(true)
    try {
      const res = await api.patch(patchUrl, body)
      return res.data
    } catch (e) {
      setError(e.response?.data?.detail || e.message)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  // POST manuel
  const post = useCallback(async (postUrl, body) => {
    setLoading(true)
    try {
      const res = await api.post(postUrl, body)
      return res.data
    } catch (e) {
      setError(e.response?.data?.detail || e.message)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])
  const del = useCallback(async (delUrl) => {
  setLoading(true)
  try {
    const res = await api.delete(delUrl)
    return res.data
  } catch (e) {
    setError(e.response?.data?.detail || e.message)
    setData([]) 
    throw e
  } finally {
    setLoading(false)
  }
}, [])

  return { data, loading, error, patch, post ,del }
}