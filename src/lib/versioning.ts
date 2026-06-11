import type { TiptapNode } from './diff'

export interface VersionRecord {
  id: string
  author: string
  createdAt: string
  content: TiptapNode
}

export interface PreviewComparison {
  leftDoc: TiptapNode
  rightDoc: TiptapNode
  leftLabel: string
  rightLabel: string
  mode: 'version-vs-previous'
}

export function createVersionRecord(content: TiptapNode, nextIndex: number): VersionRecord {
  return {
    id: `v${nextIndex}`,
    author: '当前用户',
    createdAt: formatVersionTime(new Date()),
    content,
  }
}

export function formatVersionTime(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

export function getPreviewComparison(
  versions: VersionRecord[],
  activeVersionId: string,
  _currentDoc: TiptapNode,
): PreviewComparison {
  const activeIndex = versions.findIndex((version) => version.id === activeVersionId)
  const activeVersion = versions[activeIndex] || versions[0]
  const previousVersion = versions[activeIndex + 1] || activeVersion

  return {
    leftDoc: previousVersion.content,
    rightDoc: activeVersion.content,
    leftLabel: '前一个版本',
    rightLabel: '选中版本',
    mode: 'version-vs-previous',
  }
}
