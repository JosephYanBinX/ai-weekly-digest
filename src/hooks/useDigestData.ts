import { useState, useEffect, useCallback } from 'react'
import type { DigestIssue, IssueSummary } from '../types'

const DATA_BASE = import.meta.env.VITE_DATA_BASE || '/data/issues'
const LAST_SEEN_KEY = 'ai-digest-last-seen-issue'

export function useDigestData() {
  const [issues, setIssues] = useState<IssueSummary[]>([])
  const [currentIssue, setCurrentIssue] = useState<DigestIssue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasNewIssue, setHasNewIssue] = useState(false)

  useEffect(() => {
    fetch(`${DATA_BASE}/index.json`)
      .then(res => res.json())
      .then((data: IssueSummary[]) => {
        setIssues(data)
        if (data.length > 0) {
          const latest = data[data.length - 1]
          const lastSeen = localStorage.getItem(LAST_SEEN_KEY)
          if (lastSeen && latest.issueNumber > Number(lastSeen)) {
            setHasNewIssue(true)
          }
          loadIssue(latest.id)
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

        const latestNum = issues.length > 0
          ? issues[issues.length - 1].issueNumber
          : data.issueNumber
        if (data.issueNumber >= latestNum) {
          localStorage.setItem(LAST_SEEN_KEY, String(data.issueNumber))
          setHasNewIssue(false)
        }
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [issues])

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
    hasNewIssue,
    goToPrev,
    goToNext,
  }
}
