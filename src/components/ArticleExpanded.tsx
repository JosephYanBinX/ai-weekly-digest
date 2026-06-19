import type { Article, ReadingStatus } from '../types'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ArticleExpandedProps {
  article: Article
  status: ReadingStatus
  onToggleRead: () => void
}

function linkLabel(article: Article): string {
  if (article.url.includes('youtube.com')) return 'YouTube →'
  if (article.url.includes('bilibili.com')) return 'B站 →'
  if (article.url.includes('xiaoyuzhoufm.com')) return '小宇宙 →'
  return '阅读原文 →'
}

export function ArticleExpanded({ article, status, onToggleRead }: ArticleExpandedProps) {
  return (
    <div className="content-inner">
      <div className="content-toolbar">
        <a href={article.url} target="_blank" rel="noopener noreferrer">
          {linkLabel(article)}
        </a>
        <button className="mark-read-btn" onClick={e => { e.stopPropagation(); onToggleRead() }}>
          {status === 'read' ? '标记未读' : '标记已读'}
        </button>
      </div>

      <Markdown
        remarkPlugins={[remarkGfm]}
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
    </div>
  )
}
