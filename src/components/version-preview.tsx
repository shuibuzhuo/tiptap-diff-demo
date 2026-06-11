import { buildDiffBlocks } from '../lib/diff'
import type { PreviewComparison } from '../lib/versioning'
import DiffBlockRenderer from './diff-block-renderer'

interface VersionPreviewProps {
  comparison: PreviewComparison
}

export default function VersionPreview({ comparison }: VersionPreviewProps) {
  const blocks = buildDiffBlocks(comparison.leftDoc, comparison.rightDoc)

  return (
    <div className="preview-shell">
      <div className="preview-meta">
        <span>{comparison.leftLabel}</span>
        <span className="preview-arrow">→</span>
        <span>{comparison.rightLabel}</span>
      </div>

      <div className="preview-document">
        {blocks.map((block, index) => (
          <DiffBlockRenderer key={`${block.type}-${index}`} block={block} />
        ))}
        {blocks.length === 0 && <div className="diff-empty">当前内容与比较版本没有差异。</div>}
      </div>
    </div>
  )
}
