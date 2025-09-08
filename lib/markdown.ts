export function markdownToHtml(md: string): string {
  // Minimal markdown conversion supporting headings, emphasis, code, links, images, lists, blockquotes, hr and paragraphs
  let html = md
    // Images first to avoid being captured by link regex
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
    // Headings
    .replace(/^###\s+(.*)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.*)$/gm, '<h1>$1</h1>')
    // Blockquote and hr
    .replace(/^>\s+(.*)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^---$/gm, '<hr />')
    // Inline
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links
    .replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1<\/a>'
    )

  // Unordered lists
  html = html.replace(/(^|\n)-(\s+.*(?:\n-\s+.*)*)/g, (_m, p1, list) => {
    const items = list
      .trim()
      .split(/\n-\s+/)
      .map((s) => s.replace(/^-\s+/, '').trim())
      .filter(Boolean)
      .map((li) => `<li>${li}<\/li>`)
      .join('')
    return `${p1}<ul>${items}<\/ul>`
  })

  // Ordered lists
  html = html.replace(/(^|\n)\d+\.(\s+.*(?:\n\d+\.\s+.*)*)/g, (_m, p1, list) => {
    const items = list
      .trim()
      .split(/\n\d+\.\s+/)
      .map((s) => s.replace(/^\d+\.\s+/, '').trim())
      .filter(Boolean)
      .map((li) => `<li>${li}<\/li>`)
      .join('')
    return `${p1}<ol>${items}<\/ol>`
  })

  // Paragraphs
  html = html
    .split(/\n{2,}/)
    .map((block) => {
      if (/^<h\d|^<ul>|^<ol>|^<blockquote>|^<hr\s*\/>|^<img /i.test(block)) return block
      return `<p>${block.replace(/\n/g, '<br />')}<\/p>`
    })
    .join('\n')

  return html
}
