import '../styles/feed.css'
import type { Article } from '../types'
import type { useReadingState } from '../hooks/useReadingState'
import { ArticleItem } from './ArticleItem'

interface FeedViewProps {
  articles: Article[]
  readingState: ReturnType<typeof useReadingState>
}

export function FeedView({ articles, readingState }: FeedViewProps) {
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
    </main>
  )
}
