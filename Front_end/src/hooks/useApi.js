import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

export function useApi(url = null) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!url) return
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(url)
      setData(res.data)
    } catch (e) {
      // ← corrigé : cherche description ET detail
      setError(e.response?.data?.description || e.response?.data?.detail || e.message)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ✅ refetch exposé
  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  // PATCH
  const patch = useCallback(async (patchUrl, body) => {
    setLoading(true)
    try {
      const res = await api.patch(patchUrl, body)
      return res.data
    } catch (e) {
      // ← corrigé : cherche description ET detail
      const message = e.response?.data?.description || e.response?.data?.detail || e.message
      setError(message)
      throw new Error(message)  // ← throw avec le bon message
    } finally {
      setLoading(false)
    }
  }, [])

  // POST
  const post = useCallback(async (postUrl, body) => {
    setLoading(true)
    try {
      const res = await api.post(postUrl, body)
      return res.data
    } catch (e) {
      const message = e.response?.data?.description || e.response?.data?.detail || e.message
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  // DELETE
  const del = useCallback(async (delUrl) => {
    setLoading(true)
    try {
      const res = await api.delete(delUrl)
      return res.data
    } catch (e) {
      const message = e.response?.data?.description || e.response?.data?.detail || e.message
      setError(message)
      setData([])
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  // PUT
  const put = useCallback(async (putUrl, body) => {
    setLoading(true)
    try {
      const res = await api.put(putUrl, body)
      return res.data
    } catch (e) {
      const message = e.response?.data?.description || e.response?.data?.detail || e.message
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, refetch, patch, post, del, put }
}