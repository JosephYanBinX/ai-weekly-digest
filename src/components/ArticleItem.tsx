import { useState, useRef } from 'react'
import '../styles/article.css'
import type { Article, ReadingStatus } from '../types'
import { ArticleExpanded } from './ArticleExpanded'

interface ArticleItemProps {
  article: Article
  status: ReadingStatus
  onExpand: () => void
  onToggleRead: () => void
}

const SOURCE_LABELS: Record<string, string> = {
  latepost: '晚点 LatePost',
  stratechery: 'Stratechery',
  dwarkesh: 'Dwarkesh Podcast',
  zhangxiaojun: '张小珺 商业访谈录',
  unicorn: '海外独角兽',
}

function formatDate(date: string): string {
  const parts = date.split('-')
  return `${parts[1]}.${parts[2]}`
}

export function ArticleItem({ article, status, onExpand, onToggleRead }: ArticleItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  function toggle() {
    const willExpand = !expanded
    setExpanded(willExpand)
    if (willExpand) {
      setMounted(true)
      onExpand()
    } else {
      setTimeout(() => {
        const el = itemRef.current
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 80
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
        }
      }, 400)
    }
  }

  const sourceLabel = SOURCE_LABELS[article.source] || article.source

  const sourceLine = article.type === 'podcast'
    ? <><span className="feed-type">播客</span><span className="source-name">{sourceLabel}</span> · {article.duration} · {formatDate(article.date)}</>
    : <><span className="source-name">{sourceLabel}</span> · {article.author} · {formatDate(article.date)}</>

  return (
    <div
      ref={itemRef}
      className={`feed-item${expanded ? ' expanded' : ''}`}
      data-status={status}
    >
      <div className="feed-header" onClick={toggle}>
        <div className={`reading-dot ${status}`} />
        <div className="feed-meta">
          <div className="feed-title">{article.title}</div>
          <div className="feed-source">{sourceLine}</div>
          <p className="feed-excerpt">{article.excerpt}</p>
        </div>
        <div className="toggle-indicator">▾</div>
      </div>
      <div className="feed-content">
        <div className="feed-content-wrapper">
          {mounted && (
            <ArticleExpanded
              article={article}
              status={status}
              onToggleRead={onToggleRead}
              onCollapse={toggle}
            />
          )}
        </div>
      </div>
    </div>
  )
}
