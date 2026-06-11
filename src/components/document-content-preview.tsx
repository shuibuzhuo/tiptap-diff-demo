import { buildRenderBlocks } from '../lib/diff/engine'
import type { TiptapNode } from '../lib/diff'
import DiffBlockRenderer from './diff-block-renderer'

interface DocumentContentPreviewProps {
  document: TiptapNode
}

export default function DocumentContentPreview({ document }: DocumentContentPreviewProps) {
  const blocks = buildRenderBlocks(document, document)

  return (
    <div className="preview-document current-document-preview">
      {blocks.map((block, index) => (
        <DiffBlockRenderer key={`${block.kind}-${index}`} block={block} />
      ))}
    </div>
  )
}
