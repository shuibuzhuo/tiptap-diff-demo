import type { RenderBlock, RenderSegment } from '../lib/diff/types'

interface DiffBlockRendererProps {
  block: RenderBlock
}

export default function DiffBlockRenderer({ block }: DiffBlockRendererProps) {
  const className = `preview-block ${block.kind} ${block.changeType}`
  const content = renderSegments(block.segments)

  if (block.kind === 'heading') {
    const level = Number(block.attrs?.level || 1)
    const HeadingTag = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3'
    return <HeadingTag className={className}>{content}</HeadingTag>
  }

  if (block.kind === 'listItem') {
    return (
      <div className={className}>
        <span className="list-bullet">•</span>
        <span>{content}</span>
      </div>
    )
  }

  if (block.kind === 'taskItem') {
    const checked = Boolean(block.attrs?.checked)
    return (
      <div className={className}>
        <span className={`task-checkbox${checked ? ' checked' : ''}`}>{checked ? '☑' : '☐'}</span>
        <span>{content}</span>
      </div>
    )
  }

  if (block.kind === 'codeBlock') {
    return <pre className={className}>{content}</pre>
  }

  if (block.kind === 'blockquote') {
    return <blockquote className={className}>{content}</blockquote>
  }

  if (block.kind === 'horizontalRule') {
    const label =
      block.changeType === 'added' ? '新增分割线' : block.changeType === 'removed' ? '已删除分割线' : undefined

    return (
      <div className={className}>
        {label && <span className="rule-label">{label}</span>}
        <hr />
      </div>
    )
  }

  if (block.kind === 'imageBlock') {
    const src = typeof block.attrs?.src === 'string' ? block.attrs.src : ''
    const previousSrc = typeof block.attrs?.previousSrc === 'string' ? block.attrs.previousSrc : ''
    const width = typeof block.attrs?.width === 'string' ? block.attrs.width : undefined
    const imageChangeType = typeof block.attrs?.imageChangeType === 'string' ? block.attrs.imageChangeType : ''
    return (
      <div className={className}>
        {imageChangeType === 'replaced' && <span className="image-change-badge">图片已替换</span>}
        {imageChangeType === 'replaced' && previousSrc ? (
          <div className="image-compare-grid">
            <div className="image-compare-card old">
              <span className="image-caption">旧版本</span>
              <img className="preview-image" src={previousSrc} alt="旧版本图片" style={width ? { width } : undefined} />
            </div>
            <div className="image-compare-card new">
              <span className="image-caption">新版本</span>
              <img className="preview-image" src={src} alt="新版本图片" style={width ? { width } : undefined} />
            </div>
          </div>
        ) : src ? (
          <img className="preview-image" src={src} alt="版本图片" style={width ? { width } : undefined} />
        ) : (
          <span>图片内容</span>
        )}
      </div>
    )
  }

  if (block.kind === 'table') {
    return (
      <div className={className}>
        <table className="preview-table">
          <tbody>
            {block.children?.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {row.children?.map((cell, cellIndex) => (
                  <td key={`cell-${rowIndex}-${cellIndex}`} className={`preview-table-cell ${cell.changeType}`}>
                    {renderSegments(cell.segments)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (block.kind === 'columnGroup') {
    return (
      <div className={className}>
        <div className="preview-columns">
          {block.children?.map((column, index) => (
            <div key={`column-${index}`} className={`preview-column ${column.changeType}`}>
              {column.children?.map((child, childIndex) => <DiffBlockRenderer key={`${child.kind}-${childIndex}`} block={child} />)}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return <p className={className}>{content}</p>
}

function renderSegments(segments?: RenderSegment[]) {
  if (!segments?.length) {
    return <span className="segment unchanged"></span>
  }

  return segments.map((segment, index) => (
    <span key={`${segment.type}-${index}-${segment.text}`} className={`segment ${segment.type}`}>
      {segment.text}
    </span>
  ))
}
