import type { Article, ReadingStatus } from '../types'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkCjkFriendly from 'remark-cjk-friendly'

interface ArticleExpandedProps {
  article: Article
  status: ReadingStatus
  onToggleRead: () => void
  onCollapse: () => void
}

function sourceInfo(article: Article): string {
  const url = article.url

  if (article.type === 'podcast' || article.duration) {
    if (url.includes('xiaoyuzhoufm.com')) return `收听播客 · 小宇宙 · ${article.duration}`
    if (url.includes('youtube.com')) return `观看访谈 · YouTube · ${article.duration}`
    if (url.includes('bilibili.com')) return `观看访谈 · B站 · ${article.duration}`
    return `收听播客 · ${article.duration}`
  }

  if (url.includes('youtube.com')) return `观看视频 · YouTube`
  if (url.includes('bilibili.com')) return `观看视频 · B站`
  return `阅读原文 →`
}

export function ArticleExpanded({ article, status, onToggleRead, onCollapse }: ArticleExpandedProps) {
  return (
    <div className="content-inner">
      <div className="content-toolbar">
        <a href={article.url} target="_blank" rel="noopener noreferrer">
          {sourceInfo(article)}
        </a>
        <button className="mark-read-btn" onClick={e => { e.stopPropagation(); onToggleRead() }}>
          {status === 'read' ? '标记未读' : '标记已读'}
        </button>
      </div>

      <Markdown
        remarkPlugins={[remarkGfm, remarkCjkFriendly]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
          ),
        }}
      >
        {article.content}
      </Markdown>

      {article.dataPoints && article.dataPoints.length > 0 && (
        <div className="data-inline">
          {article.dataPoints.map((dp, i) => (
            <div className="data-inline-item" key={i}>
              <div className="data-inline-value">{dp.value}</div>
              <div className="data-inline-label">{dp.label}</div>
            </div>
          ))}
        </div>
      )}

      {article.quotes?.map((q, i) => (
        <blockquote key={i}>
          {q.text}
          {q.author && <cite>—— {q.author}</cite>}
        </blockquote>
      ))}

      {article.editorialNote && (
        <div className="editorial-note">{article.editorialNote}</div>
      )}

      {article.tags.length > 0 && (
        <div className="content-tags">
          {article.tags.map(tag => (
            <span className="content-tag" key={tag}>{tag}</span>
          ))}
        </div>
      )}

      <div className="content-footer">
        <a href={article.url} target="_blank" rel="noopener noreferrer">
          {sourceInfo(article)}
        </a>
      </div>

      <button className="collapse-btn" onClick={e => { e.stopPropagation(); onCollapse() }}>
        收起 ↑
      </button>
    </div>
  )
}
