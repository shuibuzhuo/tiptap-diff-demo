import { diffChars, diffLines } from 'diff'
export type { TiptapNode } from './diff/types'
import type { TiptapNode } from './diff/types'

export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged'
  text: string
}

export interface DiffSegment {
  type: 'added' | 'removed' | 'unchanged'
  text: string
}

export interface DiffBlock {
  type: 'heading' | 'paragraph' | 'codeBlock' | 'listItem'
  changeType: 'added' | 'removed' | 'modified' | 'unchanged'
  level?: number
  segments: DiffSegment[]
}

interface FlatBlock {
  type: DiffBlock['type']
  text: string
  level?: number
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

export function buildDiffBlocks(previousDoc: TiptapNode | null | undefined, currentDoc: TiptapNode | null | undefined) {
  const previousBlocks = extractBlocks(previousDoc)
  const currentBlocks = extractBlocks(currentDoc)
  const maxLength = Math.max(previousBlocks.length, currentBlocks.length)

  return Array.from({ length: maxLength }, (_, index) => {
    const previousBlock = previousBlocks[index]
    const currentBlock = currentBlocks[index]

    if (!previousBlock && currentBlock) {
      return {
        type: currentBlock.type,
        level: currentBlock.level,
        changeType: 'added',
        segments: [{ type: 'added', text: currentBlock.text }],
      } satisfies DiffBlock
    }

    if (previousBlock && !currentBlock) {
      return {
        type: previousBlock.type,
        level: previousBlock.level,
        changeType: 'removed',
        segments: [{ type: 'removed', text: previousBlock.text }],
      } satisfies DiffBlock
    }

    if (!previousBlock || !currentBlock) {
      return {
        type: 'paragraph',
        changeType: 'unchanged',
        segments: [],
      } satisfies DiffBlock
    }

    const segments = buildInlineSegments(previousBlock.text, currentBlock.text)
    const hasAdded = segments.some((segment) => segment.type === 'added')
    const hasRemoved = segments.some((segment) => segment.type === 'removed')

    return {
      type: currentBlock.type,
      level: currentBlock.level,
      changeType: hasAdded || hasRemoved ? 'modified' : 'unchanged',
      segments,
    } satisfies DiffBlock
  })
}

function buildInlineSegments(previousText: string, currentText: string): DiffSegment[] {
  return diffChars(previousText, currentText)
    .filter((part) => part.value.length > 0)
    .map((part) => ({
      type: part.added ? 'added' : part.removed ? 'removed' : 'unchanged',
      text: part.value,
    }))
}

function extractBlocks(doc: TiptapNode | null | undefined) {
  if (!doc?.content?.length) return []

  const blocks: FlatBlock[] = []
  doc.content.forEach((node) => collectBlocks(node, blocks))
  return blocks
}

function collectBlocks(node: TiptapNode, blocks: FlatBlock[]) {
  if (node.type === 'heading') {
    const text = getNodeText(node).trim()
    if (text) {
      blocks.push({
        type: 'heading',
        text,
        level: typeof node.attrs?.level === 'number' ? (node.attrs.level as number) : 1,
      })
    }
    return
  }

  if (node.type === 'paragraph') {
    const text = getNodeText(node).trim()
    if (text) {
      blocks.push({ type: 'paragraph', text })
    }
    return
  }

  if (node.type === 'codeBlock') {
    const text = getNodeText(node)
    if (text.trim()) {
      blocks.push({ type: 'codeBlock', text })
    }
    return
  }

  if (node.type === 'listItem') {
    const text = node.content
      ?.filter((child) => child.type === 'paragraph')
      .map(getNodeText)
      .join('')
      .trim()
    if (text) {
      blocks.push({ type: 'listItem', text })
    }
  }

  node.content?.forEach((child) => collectBlocks(child, blocks))
}
