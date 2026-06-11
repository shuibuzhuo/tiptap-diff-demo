import { diffChars } from 'diff'
import { normalizeDocument } from './normalize'
import type { ChangeType, DiffBlockModel, MatchedBlockPair, RenderBlock, RenderSegment, TiptapNode } from './types'

export function buildRenderBlocks(previousDoc: TiptapNode | null | undefined, currentDoc: TiptapNode | null | undefined) {
  const previousBlocks = normalizeDocument(previousDoc)
  const currentBlocks = normalizeDocument(currentDoc)

  return matchBlocks(previousBlocks, currentBlocks).map((pair) => classifyPair(pair.previous, pair.current))
}

function matchBlocks(previousBlocks: DiffBlockModel[], currentBlocks: DiffBlockModel[]): MatchedBlockPair[] {
  const pairs: MatchedBlockPair[] = []
  let previousIndex = 0
  let currentIndex = 0

  while (previousIndex < previousBlocks.length || currentIndex < currentBlocks.length) {
    const previousBlock = previousBlocks[previousIndex]
    const currentBlock = currentBlocks[currentIndex]

    if (!previousBlock) {
      pairs.push({ current: currentBlock })
      currentIndex += 1
      continue
    }

    if (!currentBlock) {
      pairs.push({ previous: previousBlock })
      previousIndex += 1
      continue
    }

    if (canMatch(previousBlock, currentBlock)) {
      pairs.push({ previous: previousBlock, current: currentBlock })
      previousIndex += 1
      currentIndex += 1
      continue
    }

    const nextCurrentOffset = findLookahead(currentBlocks, currentIndex + 1, previousBlock)
    const nextPreviousOffset = findLookahead(previousBlocks, previousIndex + 1, currentBlock)

    if (nextCurrentOffset !== -1 && (nextPreviousOffset === -1 || nextCurrentOffset <= nextPreviousOffset)) {
      pairs.push({ current: currentBlock })
      currentIndex += 1
      continue
    }

    if (nextPreviousOffset !== -1) {
      pairs.push({ previous: previousBlock })
      previousIndex += 1
      continue
    }

    pairs.push({ previous: previousBlock })
    previousIndex += 1
  }

  return pairs
}

function findLookahead(blocks: DiffBlockModel[], startIndex: number, target: DiffBlockModel) {
  const endIndex = Math.min(startIndex + 3, blocks.length)
  for (let index = startIndex; index < endIndex; index += 1) {
    if (canMatch(target, blocks[index])) {
      return index - startIndex + 1
    }
  }
  return -1
}

function canMatch(previous: DiffBlockModel, current: DiffBlockModel) {
  if (previous.kind !== current.kind) return false

  if (previous.kind === 'horizontalRule') return true
  if (previous.kind === 'imageBlock') return true
  if (previous.kind === 'columnGroup') {
    return previous.attrs?.layout === current.attrs?.layout && previous.children?.length === current.children?.length
  }
  if (previous.kind === 'column') {
    return previous.attrs?.position === current.attrs?.position
  }

  return true
}

function classifyPair(previous?: DiffBlockModel, current?: DiffBlockModel): RenderBlock {
  if (!previous && current) return createSingleSidedBlock(current, 'added')
  if (previous && !current) return createSingleSidedBlock(previous, 'removed')
  if (!previous || !current) {
    return { kind: 'paragraph', changeType: 'unchanged' }
  }

  switch (current.kind) {
    case 'heading':
    case 'paragraph':
    case 'listItem':
    case 'blockquote':
    case 'codeBlock':
    case 'tableCell':
      return classifyTextualBlock(previous, current)
    case 'taskItem':
      return classifyTaskBlock(previous, current)
    case 'horizontalRule':
      return { kind: 'horizontalRule', changeType: 'unchanged' }
    case 'imageBlock':
      return classifyImageBlock(previous, current)
    case 'table':
    case 'tableRow':
    case 'columnGroup':
    case 'column':
      return classifyContainerBlock(previous, current)
    default:
      return classifyTextualBlock(previous, current)
  }
}

function classifyTextualBlock(previous: DiffBlockModel, current: DiffBlockModel): RenderBlock {
  const segments = buildSegments(previous.text || '', current.text || '')
  const changeType = hasTextChanges(segments) || hasAttrChanges(previous.attrs, current.attrs) ? 'modified' : 'unchanged'

  return {
    kind: current.kind,
    changeType,
    text: current.text,
    attrs: current.attrs,
    segments,
  }
}

function classifyTaskBlock(previous: DiffBlockModel, current: DiffBlockModel): RenderBlock {
  const segments = buildSegments(previous.text || '', current.text || '')
  const checkedChanged = previous.attrs?.checked !== current.attrs?.checked
  const changeType = checkedChanged || hasTextChanges(segments) ? 'modified' : 'unchanged'

  return {
    kind: 'taskItem',
    changeType,
    text: current.text,
    attrs: current.attrs,
    segments,
  }
}

function classifyImageBlock(previous: DiffBlockModel, current: DiffBlockModel): RenderBlock {
  const previousSrc = typeof previous.attrs?.src === 'string' ? previous.attrs.src : undefined
  const currentSrc = typeof current.attrs?.src === 'string' ? current.attrs.src : undefined
  const imageChangeType =
    previousSrc && currentSrc && previousSrc !== currentSrc
      ? 'replaced'
      : hasAttrChanges(previous.attrs, current.attrs)
        ? 'updated'
        : 'unchanged'

  return {
    kind: 'imageBlock',
    changeType: imageChangeType === 'unchanged' ? 'unchanged' : 'modified',
    attrs: {
      ...current.attrs,
      previousSrc,
      imageChangeType,
    },
  }
}

function classifyContainerBlock(previous: DiffBlockModel, current: DiffBlockModel): RenderBlock {
  const children = matchBlocks(previous.children || [], current.children || []).map((pair) => classifyPair(pair.previous, pair.current))
  const childChanged = children.some((child) => child.changeType !== 'unchanged')
  const changeType = childChanged || hasAttrChanges(previous.attrs, current.attrs) ? 'modified' : 'unchanged'

  return {
    kind: current.kind,
    changeType,
    attrs: current.attrs,
    children,
  }
}

function createSingleSidedBlock(block: DiffBlockModel, changeType: Extract<ChangeType, 'added' | 'removed'>): RenderBlock {
  const segmentType = changeType === 'added' ? 'added' : 'removed'

  if (block.kind === 'horizontalRule') {
    return { kind: 'horizontalRule', changeType }
  }

  if (block.kind === 'imageBlock') {
    return {
      kind: 'imageBlock',
      changeType,
      attrs: block.attrs,
    }
  }

  if (block.children?.length) {
    return {
      kind: block.kind,
      changeType,
      attrs: block.attrs,
      children: block.children.map((child) => createSingleSidedBlock(child, changeType)),
    }
  }

  return {
    kind: block.kind,
    changeType,
    text: block.text,
    attrs: block.attrs,
    segments: block.text ? [{ type: segmentType, text: block.text }] : [],
  }
}

function buildSegments(previousText: string, currentText: string): RenderSegment[] {
  return diffChars(previousText, currentText)
    .filter((part) => part.value.length > 0)
    .map((part) => ({
      type: part.added ? 'added' : part.removed ? 'removed' : 'unchanged',
      text: part.value,
    }))
}

function hasTextChanges(segments: RenderSegment[]) {
  return segments.some((segment) => segment.type !== 'unchanged')
}

function hasAttrChanges(previous?: Record<string, unknown>, current?: Record<string, unknown>) {
  return JSON.stringify(previous || {}) !== JSON.stringify(current || {})
}
