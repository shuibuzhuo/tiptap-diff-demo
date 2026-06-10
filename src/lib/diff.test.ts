import { describe, expect, it } from 'vitest'
import { buildDiffLines, tiptapJsonToPlainText } from './diff'

const baseVersion = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      attrs: { textAlign: 'left' },
      content: [
        { type: 'text', text: '划水AI' },
        { type: 'text', text: ' 是 Node 全栈开发的 AIGC 知识库平台。' },
      ],
    },
    {
      type: 'paragraph',
      attrs: { textAlign: 'left' },
      content: [{ type: 'text', text: '它包括文档管理、富文本编辑器、多人协同编辑。' }],
    },
  ],
}

const currentVersion = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      attrs: { textAlign: 'left' },
      content: [
        { type: 'text', text: '划水AI' },
        { type: 'text', text: ' 是 Node 全栈开发的 AIGC 知识库平台，支持版本对比。' },
      ],
    },
    {
      type: 'paragraph',
      attrs: { textAlign: 'left' },
      content: [{ type: 'text', text: '它包括文档管理、富文本编辑器、多人协同编辑。' }],
    },
    {
      type: 'paragraph',
      attrs: { textAlign: 'left' },
      content: [{ type: 'text', text: '这里新增了一段用于演示 diff 的内容。' }],
    },
  ],
}

describe('tiptap diff helpers', () => {
  it('将 tiptap json 转成换行纯文本', () => {
    expect(tiptapJsonToPlainText(baseVersion)).toBe(
      ['划水AI 是 Node 全栈开发的 AIGC 知识库平台。', '它包括文档管理、富文本编辑器、多人协同编辑。'].join('\n'),
    )
  })

  it('生成包含新增和删除的行级 diff', () => {
    const diffLines = buildDiffLines(baseVersion, currentVersion)

    expect(diffLines).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'removed',
          text: '划水AI 是 Node 全栈开发的 AIGC 知识库平台。',
        }),
        expect.objectContaining({
          type: 'added',
          text: '划水AI 是 Node 全栈开发的 AIGC 知识库平台，支持版本对比。',
        }),
        expect.objectContaining({
          type: 'added',
          text: '这里新增了一段用于演示 diff 的内容。',
        }),
      ]),
    )
  })
})
