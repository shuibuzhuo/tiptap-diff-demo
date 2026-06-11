import type { DiffBlockModel, TiptapNode } from './types'

export function normalizeDocument(doc: TiptapNode | null | undefined): DiffBlockModel[] {
  if (!doc?.content?.length) return []

  const blocks: DiffBlockModel[] = []
  doc.content.forEach((node) => {
    blocks.push(...normalizeNode(node))
  })
  return blocks
}

function normalizeNode(node: TiptapNode): DiffBlockModel[] {
  switch (node.type) {
    case 'heading':
      return [createTextBlock('heading', node, { level: node.attrs?.level })]
    case 'paragraph':
      return [createTextBlock('paragraph', node)]
    case 'blockquote':
      return [createTextBlock('blockquote', node)]
    case 'codeBlock':
      return [createTextBlock('codeBlock', node, { language: node.attrs?.language })]
    case 'bulletList':
    case 'orderedList':
    case 'taskList':
      return (node.content || []).flatMap((child) => normalizeNode(child))
    case 'listItem':
      return [
        {
          kind: 'listItem',
          text: extractListItemText(node),
          children: normalizeChildren(node.content || []),
          signature: `listItem:${extractListItemText(node)}`,
        },
      ]
    case 'taskItem':
      return [
        {
          kind: 'taskItem',
          text: extractText(node).trim(),
          attrs: { checked: Boolean(node.attrs?.checked) },
          children: normalizeChildren(node.content || []),
          signature: `taskItem:${extractText(node).trim()}`,
        },
      ]
    case 'horizontalRule':
      return [{ kind: 'horizontalRule', signature: 'horizontalRule' }]
    case 'imageBlock':
      return [
        {
          kind: 'imageBlock',
          attrs: {
            src: node.attrs?.src,
            width: node.attrs?.width,
            align: node.attrs?.align,
            ratio: node.attrs?.ratio,
          },
          signature: `image:${String(node.attrs?.src || '')}`,
        },
      ]
    case 'table':
      return [
        {
          kind: 'table',
          children: (node.content || []).map((row) => normalizeTableRow(row)),
          signature: `table:${node.content?.length || 0}`,
        },
      ]
    case 'columns':
      return [
        {
          kind: 'columnGroup',
          attrs: { layout: node.attrs?.layout },
          children: (node.content || []).map((column) => normalizeColumn(column)),
          signature: `columns:${node.attrs?.layout || ''}:${node.content?.length || 0}`,
        },
      ]
    case 'column':
      return [normalizeColumn(node)]
    default:
      return normalizeChildren(node.content || [])
  }
}

function createTextBlock(kind: DiffBlockModel['kind'], node: TiptapNode, attrs?: Record<string, unknown>): DiffBlockModel {
  const text = extractText(node).trim()
  return {
    kind,
    text,
    attrs,
    signature: `${kind}:${text}`,
  }
}

function normalizeChildren(nodes: TiptapNode[]) {
  return nodes.flatMap((child) => normalizeNode(child))
}

function normalizeTableRow(node: TiptapNode): DiffBlockModel {
  return {
    kind: 'tableRow',
    children: (node.content || []).map((cell) => ({
      kind: 'tableCell',
      text: extractText(cell).trim(),
      signature: `tableCell:${extractText(cell).trim()}`,
    })),
    signature: `tableRow:${node.content?.length || 0}`,
  }
}

function normalizeColumn(node: TiptapNode): DiffBlockModel {
  return {
    kind: 'column',
    attrs: { position: node.attrs?.position },
    children: normalizeChildren(node.content || []),
    signature: `column:${String(node.attrs?.position || '')}`,
  }
}

function extractListItemText(node: TiptapNode) {
  return (node.content || [])
    .filter((child) => child.type === 'paragraph')
    .map((child) => extractText(child))
    .join(' ')
    .trim()
}

function extractText(node: TiptapNode): string {
  if (node.type === 'text') return node.text || ''
  if (!node.content?.length) return ''
  return node.content.map((child) => extractText(child)).join('')
}
