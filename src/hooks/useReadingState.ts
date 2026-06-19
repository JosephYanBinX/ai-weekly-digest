import { useState, useCallback } from 'react'
import type { ReadingStatus } from '../types'

const STORAGE_KEY = 'ai-digest-reading-state'

type ReadingStateMap = Record<string, ReadingStatus>

function loadState(): ReadingStateMap {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function persistState(state: ReadingStateMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useReadingState() {
  const [state, setState] = useState<ReadingStateMap>(loadState)

  const getStatus = useCallback((articleId: string): ReadingStatus => {
    return state[articleId] || 'unread'
  }, [state])

  const markReading = useCallback((articleId: string) => {
    setState(prev => {
      if (prev[articleId] && prev[articleId] !== 'unread') return prev
      const next: ReadingStateMap = { ...prev, [articleId]: 'reading' }
      persistState(next)
      return next
    })
  }, [])

  const toggleRead = useCallback((articleId: string) => {
    setState(prev => {
      const current = prev[articleId] || 'unread'
      const status: ReadingStatus = current === 'read' ? 'unread' : 'read'
      const updated: ReadingStateMap = { ...prev, [articleId]: status }
      persistState(updated)
      return updated
    })
  }, [])

  const countUnread = useCallback((articleIds: string[]): number => {
    return articleIds.filter(id => {
      const s = state[id] || 'unread'
      return s !== 'read'
    }).length
  }, [state])

  return { getStatus, markReading, toggleRead, countUnread }
}
