import { describe, expect, it } from 'vitest'
import type { TiptapNode } from './diff'
import { createVersionRecord, getPreviewComparison } from './versioning'

function createDoc(text: string): TiptapNode {
  return {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text }],
      },
    ],
  }
}

describe('versioning helpers', () => {
  it('创建版本时会生成新版本并保留正文', () => {
    const content = createDoc('当前内容')
    const version = createVersionRecord(content, 4)

    expect(version.id).toBe('v4')
    expect(version.author).toBe('当前用户')
    expect(version.content).toEqual(content)
    expect(version.createdAt).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/)
  })

  it('选中最新版本时，预览它与前一个版本', () => {
    const versions = [
      { id: 'v3', author: '当前用户', createdAt: '2026-06-08 10:30', content: createDoc('最新版本') },
      { id: 'v2', author: '当前用户', createdAt: '2026-06-08 09:12', content: createDoc('次新版本') },
    ]
    const currentDoc = createDoc('当前草稿')

    const comparison = getPreviewComparison(versions, versions[0].id, currentDoc)

    expect(comparison.mode).toBe('version-vs-previous')
    expect(comparison.leftLabel).toBe('前一个版本')
    expect(comparison.rightLabel).toBe('选中版本')
    expect(comparison.leftDoc).toEqual(versions[1].content)
    expect(comparison.rightDoc).toEqual(versions[0].content)
  })

  it('选中旧版本时，预览该版本与它前一个版本', () => {
    const versions = [
      { id: 'v3', author: '当前用户', createdAt: '2026-06-08 10:30', content: createDoc('最新版本') },
      { id: 'v2', author: '当前用户', createdAt: '2026-06-08 09:12', content: createDoc('中间版本') },
      { id: 'v1', author: '当前用户', createdAt: '2026-06-07 22:05', content: createDoc('更早版本') },
    ]
    const currentDoc = createDoc('当前草稿')

    const comparison = getPreviewComparison(versions, 'v2', currentDoc)

    expect(comparison.mode).toBe('version-vs-previous')
    expect(comparison.leftLabel).toBe('前一个版本')
    expect(comparison.rightLabel).toBe('选中版本')
    expect(comparison.leftDoc).toEqual(versions[2].content)
    expect(comparison.rightDoc).toEqual(versions[1].content)
  })

  it('只有一个版本时，预览自身内容', () => {
    const versions = [{ id: 'v1', author: '当前用户', createdAt: '2026-06-08 10:30', content: createDoc('唯一版本') }]

    const comparison = getPreviewComparison(versions, 'v1', createDoc('当前草稿'))

    expect(comparison.mode).toBe('version-vs-previous')
    expect(comparison.leftDoc).toEqual(versions[0].content)
    expect(comparison.rightDoc).toEqual(versions[0].content)
  })
})
