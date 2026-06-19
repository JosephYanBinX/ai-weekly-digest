export interface DigestIssue {
  id: string
  issueNumber: number
  dateRange: [string, string]
  generatedAt: string
  articles: Article[]
}

export interface Article {
  id: string
  source: string
  type: "article" | "podcast"
  title: string
  author: string
  date: string
  url: string
  excerpt: string
  content: string
  duration?: string
  tags: string[]
  dataPoints?: DataPoint[]
  quotes?: Quote[]
  editorialNote?: string
}

export interface DataPoint {
  value: string
  label: string
}

export interface Quote {
  text: string
  author: string
}

export type ReadingStatus = "unread" | "reading" | "read"

export interface IssueSummary {
  id: string
  issueNumber: number
  dateRange: [string, string]
  articleCount: number
}
