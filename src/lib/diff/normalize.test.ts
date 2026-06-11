import { describe, expect, it } from 'vitest'
import { normalizeDocument } from './normalize'

const complexDoc = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [{ type: 'text', text: '一段文字' }],
    },
    {
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          attrs: { checked: true },
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: '计划 1' }],
            },
          ],
        },
      ],
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '一段引用' }],
        },
      ],
    },
    {
      type: 'horizontalRule',
    },
    {
      type: 'table',
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '姓名' }] }],
            },
            {
              type: 'tableCell',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '年龄' }] }],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '张三' }] }],
            },
            {
              type: 'tableCell',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '20' }] }],
            },
          ],
        },
      ],
    },
    {
      type: 'columns',
      attrs: { layout: 'two-column' },
      content: [
        {
          type: 'column',
          attrs: { position: 'left' },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '第一列' }] }],
        },
        {
          type: 'column',
          attrs: { position: 'right' },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '第二列' }] }],
        },
      ],
    },
  ],
}

describe('normalizeDocument', () => {
  it('保留复杂块的结构信息，而不是全部压平成文本', () => {
    const blocks = normalizeDocument(complexDoc)

    expect(blocks).toEqual([
      expect.objectContaining({
        kind: 'paragraph',
        text: '一段文字',
      }),
      expect.objectContaining({
        kind: 'taskItem',
        text: '计划 1',
        attrs: expect.objectContaining({ checked: true }),
      }),
      expect.objectContaining({
        kind: 'blockquote',
        text: '一段引用',
      }),
      expect.objectContaining({
        kind: 'horizontalRule',
      }),
      expect.objectContaining({
        kind: 'table',
        children: [
          expect.objectContaining({
            kind: 'tableRow',
            children: [
              expect.objectContaining({ kind: 'tableCell', text: '姓名' }),
              expect.objectContaining({ kind: 'tableCell', text: '年龄' }),
            ],
          }),
          expect.objectContaining({
            kind: 'tableRow',
            children: [
              expect.objectContaining({ kind: 'tableCell', text: '张三' }),
              expect.objectContaining({ kind: 'tableCell', text: '20' }),
            ],
          }),
        ],
      }),
      expect.objectContaining({
        kind: 'columnGroup',
        attrs: expect.objectContaining({ layout: 'two-column' }),
        children: [
          expect.objectContaining({
            kind: 'column',
            attrs: expect.objectContaining({ position: 'left' }),
            children: [expect.objectContaining({ kind: 'paragraph', text: '第一列' })],
          }),
          expect.objectContaining({
            kind: 'column',
            attrs: expect.objectContaining({ position: 'right' }),
            children: [expect.objectContaining({ kind: 'paragraph', text: '第二列' })],
          }),
        ],
      }),
    ])
  })
})
