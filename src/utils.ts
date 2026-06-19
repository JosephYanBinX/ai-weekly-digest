export function estimateReadingTime(content: string): number {
  const chineseChars = (content.match(/[一-鿿]/g) || []).length
  const englishWords = content.replace(/[一-鿿]/g, '').split(/\s+/).filter(Boolean).length
  const minutes = chineseChars / 400 + englishWords / 200
  return Math.max(1, Math.round(minutes))
}
