interface HeaderProps {
  dateRange: [string, string]
  issueNumber: number
  unreadCount: number
  totalCount: number
  hasPrev: boolean
  hasNext: boolean
  hasNewIssue: boolean
  onPrev: () => void
  onNext: () => void
}

function formatDateRange(range: [string, string]): string {
  const [start, end] = range
  const s = start.split('-')
  const e = end.split('-')
  return `${s[0]}.${s[1]}.${s[2]} – ${e[1]}.${e[2]}`
}

export function Header({
  dateRange,
  issueNumber,
  unreadCount,
  totalCount,
  hasPrev,
  hasNext,
  hasNewIssue,
  onPrev,
  onNext,
}: HeaderProps) {
  return (
    <div className="header">
      <div className="header-inner">
        <div className="header-left">
          <h1>AI 周报</h1>
          <div className="header-date">{formatDateRange(dateRange)}</div>
        </div>
        <div className="header-right">
          <div className="header-stats">
            <span>{unreadCount}</span> 未读 / {totalCount} 篇
          </div>
          <div className="issue-nav">
            <button disabled={!hasPrev} onClick={onPrev}>←</button>
            <span className="issue-num">
              #{issueNumber}
              {hasNewIssue && <span className="new-dot" />}
            </span>
            <button disabled={!hasNext} onClick={onNext}>→</button>
          </div>
        </div>
      </div>
    </div>
  )
}
