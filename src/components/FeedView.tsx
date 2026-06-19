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
  return (
    <main className="feed">
      {articles.map(article => (
        <ArticleItem
          key={article.id}
          article={article}
          status={readingState.getStatus(article.id)}
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
