import { describe, expect, it } from 'vitest'
import { buildRenderBlocks } from './engine'

const previousDoc = {
  type: 'doc',
  content: [
    {
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          attrs: { checked: false },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '计划 1' }] }],
        },
      ],
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

const currentDoc = {
  type: 'doc',
  content: [
    {
      type: 'taskList',
      content: [
        {
          type: 'taskItem',
          attrs: { checked: true },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '计划 1 更新' }] }],
        },
      ],
    },
    {
      type: 'table',
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '姓名更新' }] }],
            },
            {
              type: 'tableCell',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '年龄' }] }],
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
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '第一列更新' }] }],
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

describe('buildRenderBlocks', () => {
  it('为任务、表格和分栏生成保留结构的预览数据', () => {
    const blocks = buildRenderBlocks(previousDoc, currentDoc)

    expect(blocks[0]).toMatchObject({
      kind: 'taskItem',
      changeType: 'modified',
      attrs: expect.objectContaining({ checked: true }),
    })
    expect(blocks[0].segments?.some((segment) => segment.type === 'added' && segment.text.includes('更新'))).toBe(true)

    expect(blocks[1]).toMatchObject({
      kind: 'table',
      changeType: 'modified',
    })
    expect(blocks[1].children?.[0].children?.[0].segments).toEqual([
      { type: 'unchanged', text: '姓名' },
      { type: 'added', text: '更新' },
    ])

    expect(blocks[2]).toMatchObject({
      kind: 'columnGroup',
      changeType: 'modified',
    })
    expect(blocks[2].children?.[0]).toMatchObject({
      kind: 'column',
      changeType: 'modified',
    })
    expect(blocks[2].children?.[0].children?.[0].segments?.some((segment) => segment.type === 'added' && segment.text.includes('更新'))).toBe(true)
    expect(blocks[2].children?.[1]).toMatchObject({
      kind: 'column',
      changeType: 'unchanged',
    })
  })

  it('图片替换时保留前后图片信息，供预览区展示替换提示', () => {
    const blocks = buildRenderBlocks(
      {
        type: 'doc',
        content: [
          {
            type: 'imageBlock',
            attrs: { src: 'https://example.com/old.png', width: '75%', align: 'center' },
          },
        ],
      },
      {
        type: 'doc',
        content: [
          {
            type: 'imageBlock',
            attrs: { src: 'https://example.com/new.png', width: '75%', align: 'center' },
          },
        ],
      },
    )

    expect(blocks[0]).toMatchObject({
      kind: 'imageBlock',
      changeType: 'modified',
      attrs: expect.objectContaining({
        src: 'https://example.com/new.png',
        previousSrc: 'https://example.com/old.png',
        imageChangeType: 'replaced',
      }),
    })
  })
})
