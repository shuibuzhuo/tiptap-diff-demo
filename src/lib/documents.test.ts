import { describe, expect, it } from 'vitest'
import { mockDocuments, saveVersionToDocuments } from './documents'

describe('document history helpers', () => {
  it('提供两个独立文档，每个文档都有自己的版本历史', () => {
    expect(mockDocuments).toHaveLength(2)
    expect(mockDocuments[0]).toMatchObject({
      id: 'doc-simple',
      title: '简单文档',
    })
    expect(mockDocuments[1]).toMatchObject({
      id: 'doc-complex',
      title: '复杂格式文档',
    })
    expect(mockDocuments[0].versions.length).toBeGreaterThan(1)
    expect(mockDocuments[1].versions.length).toBeGreaterThan(1)
  })

  it('保存版本时只追加到当前文档，不影响其他文档', () => {
    const updatedDocuments = saveVersionToDocuments(mockDocuments, 'doc-complex', {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: '复杂文档新版本' }] }],
    })

    const simpleDocument = updatedDocuments.find((document) => document.id === 'doc-simple')
    const complexDocument = updatedDocuments.find((document) => document.id === 'doc-complex')

    expect(simpleDocument?.versions).toHaveLength(mockDocuments[0].versions.length)
    expect(complexDocument?.versions).toHaveLength(mockDocuments[1].versions.length + 1)
    expect(complexDocument?.versions[0]).toMatchObject({
      author: '当前用户',
      content: {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: '复杂文档新版本' }] }],
      },
    })
  })
})
