import { useDigestData } from './hooks/useDigestData'
import { useReadingState } from './hooks/useReadingState'
import { Header } from './components/Header'
import { FeedView } from './components/FeedView'

export function App() {
  const {
    currentIssue,
    loading,
    error,
    hasPrev,
    hasNext,
    goToPrev,
    goToNext,
  } = useDigestData()

  const readingState = useReadingState()

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          重新加载
        </button>
      </div>
    )
  }

  if (loading || !currentIssue) {
    return <div className="loading">加载中...</div>
  }

  const articleIds = currentIssue.articles.map(a => a.id)
  const unreadCount = readingState.countUnread(articleIds)

  return (
    <>
      <Header
        dateRange={currentIssue.dateRange}
        issueNumber={currentIssue.issueNumber}
        unreadCount={unreadCount}
        totalCount={currentIssue.articles.length}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPrev={goToPrev}
        onNext={goToNext}
      />
      <FeedView
        articles={currentIssue.articles}
        readingState={readingState}
      />
      <div className="footer">
        AI 周报 #{currentIssue.issueNumber} · {currentIssue.generatedAt} 生成
      </div>
    </>
  )
}
