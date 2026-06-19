import { useState, useEffect, useCallback } from 'react'
import type { DigestIssue, IssueSummary } from '../types'

const DATA_BASE = import.meta.env.VITE_DATA_BASE || '/data/issues'

export function useDigestData() {
  const [issues, setIssues] = useState<IssueSummary[]>([])
  const [currentIssue, setCurrentIssue] = useState<DigestIssue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${DATA_BASE}/index.json`)
      .then(res => res.json())
      .then((data: IssueSummary[]) => {
        setIssues(data)
        if (data.length > 0) {
          loadIssue(data[data.length - 1].id)
        } else {
          setLoading(false)
        }
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const loadIssue = useCallback((id: string) => {
    setLoading(true)
    setError(null)
    fetch(`${DATA_BASE}/${id}.json`)
      .then(res => {
        if (!res.ok) throw new Error(`Issue ${id} not found`)
        return res.json()
      })
      .then((data: DigestIssue) => {
        setCurrentIssue(data)
        setLoading(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const currentIndex = currentIssue
    ? issues.findIndex(i => i.id === currentIssue.id)
    : -1

  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < issues.length - 1 && currentIndex >= 0

  const goToPrev = useCallback(() => {
    if (hasPrev) loadIssue(issues[currentIndex - 1].id)
  }, [hasPrev, currentIndex, issues, loadIssue])

  const goToNext = useCallback(() => {
    if (hasNext) loadIssue(issues[currentIndex + 1].id)
  }, [hasNext, currentIndex, issues, loadIssue])

  return {
    issues,
    currentIssue,
    loading,
    error,
    loadIssue,
    hasPrev,
    hasNext,
    goToPrev,
    goToNext,
  }
}
