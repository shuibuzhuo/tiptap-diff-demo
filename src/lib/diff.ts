import { diffLines } from 'diff'

export interface TiptapNode {
  type?: string
  text?: string
  attrs?: Record<string, unknown>
  marks?: Array<Record<string, unknown>>
  content?: TiptapNode[]
}

export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  text: string
}

export function tiptapJsonToPlainText(doc: TiptapNode | null | undefined) {
  if (!doc) return ''

  const lines: string[] = []

  walkNode(doc, lines)

  return lines.filter(Boolean).join('\n')
}

function walkNode(node: TiptapNode, lines: string[]) {
  if (node.type === 'text') {
    lines.push(node.text || '')
    return
  }

  if (!node.content?.length) return

  if (isBlockNode(node.type)) {
    const blockText = node.content.map(getNodeText).join('').trim()
    if (blockText) lines.push(blockText)
    node.content.forEach((child) => {
      if (isNestedBlock(node.type, child.type)) {
        walkNode(child, lines)
      }
    })
    return
  }

  node.content.forEach((child) => walkNode(child, lines))
}

function getNodeText(node: TiptapNode): string {
  if (node.type === 'text') return node.text || ''
  if (!node.content?.length) return ''
  return node.content.map(getNodeText).join('')
}

function isBlockNode(type?: string) {
  return ['paragraph', 'heading', 'blockquote', 'codeBlock', 'listItem'].includes(type || '')
}

function isNestedBlock(parentType?: string, childType?: string) {
  if (parentType !== 'listItem') return false
  return ['bulletList', 'orderedList'].includes(childType || '')
}

export function buildDiffLines(previousDoc: TiptapNode | null | undefined, currentDoc: TiptapNode | null | undefined) {
  const previousText = tiptapJsonToPlainText(previousDoc)
  const currentText = tiptapJsonToPlainText(currentDoc)

  return diffLines(previousText, currentText).flatMap((part) => {
    const type: DiffLine['type'] = part.added ? 'added' : part.removed ? 'removed' : 'unchanged'
    return part.value
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => ({ type, text: line }))
  })
}
