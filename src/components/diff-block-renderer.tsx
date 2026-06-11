import type { DiffBlock } from '../lib/diff'

interface DiffBlockRendererProps {
  block: DiffBlock
}

export default function DiffBlockRenderer({ block }: DiffBlockRendererProps) {
  const className = `preview-block ${block.type} ${block.changeType}`
  const content = block.segments.length > 0 ? (
    block.segments.map((segment, index) => (
      <span key={`${segment.type}-${index}-${segment.text}`} className={`segment ${segment.type}`}>
        {segment.text}
      </span>
    ))
  ) : (
    <span className="segment unchanged"></span>
  )

  if (block.type === 'heading') {
    const HeadingTag = block.level === 1 ? 'h1' : block.level === 2 ? 'h2' : 'h3'
    return <HeadingTag className={className}>{content}</HeadingTag>
  }

  if (block.type === 'listItem') {
    return (
      <div className={className}>
        <span className="list-bullet">•</span>
        <span>{content}</span>
      </div>
    )
  }

  if (block.type === 'codeBlock') {
    return <pre className={className}>{content}</pre>
  }

  return <p className={className}>{content}</p>
}
