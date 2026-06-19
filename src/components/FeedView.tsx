import { useState } from 'react'
import '../styles/feed.css'
import type { Article } from '../types'
import type { useReadingState } from '../hooks/useReadingState'
import { ArticleItem } from './ArticleItem'

interface FeedViewProps {
  articles: Article[]
  readingState: ReturnType<typeof useReadingState>
  unreadCount: number
}

export function FeedView({ articles, readingState, unreadCount }: FeedViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <main className="feed">
      {articles.map(article => (
        <ArticleItem
          key={article.id}
          article={article}
          expanded={expandedId === article.id}
          status={readingState.getStatus(article.id)}
          onToggle={() => setExpandedId(prev => prev === article.id ? null : article.id)}
          onExpand={() => readingState.markReading(article.id)}
          onToggleRead={() => readingState.toggleRead(article.id)}
        />
      ))}
      {unreadCount === 0 && articles.length > 0 && (
        <div className="all-read-hint">本期已读完</div>
      )}
    </main>
  )
}
