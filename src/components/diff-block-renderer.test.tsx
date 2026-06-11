import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DiffBlockRenderer from './diff-block-renderer'
import type { RenderBlock } from '../lib/diff/types'

describe('DiffBlockRenderer', () => {
  it('图片替换时显示替换提示，并同时渲染新旧图片', () => {
    const block: RenderBlock = {
      kind: 'imageBlock',
      changeType: 'modified',
      attrs: {
        src: 'https://example.com/new.png',
        previousSrc: 'https://example.com/old.png',
        imageChangeType: 'replaced',
      },
    }

    render(<DiffBlockRenderer block={block} />)

    expect(screen.getByText('图片已替换')).toBeTruthy()
    expect(screen.getByAltText('旧版本图片')).toBeTruthy()
    expect(screen.getByAltText('新版本图片')).toBeTruthy()
  })

  it('分割线新增和删除时显示独立语义文案', () => {
    render(
      <div>
        <DiffBlockRenderer block={{ kind: 'horizontalRule', changeType: 'added' }} />
        <DiffBlockRenderer block={{ kind: 'horizontalRule', changeType: 'removed' }} />
      </div>,
    )

    expect(screen.getByText('新增分割线')).toBeTruthy()
    expect(screen.getByText('已删除分割线')).toBeTruthy()
  })

  it('表格里的变更单元格带有单独样式 class', () => {
    const block: RenderBlock = {
      kind: 'table',
      changeType: 'modified',
      children: [
        {
          kind: 'tableRow',
          changeType: 'modified',
          children: [
            {
              kind: 'tableCell',
              changeType: 'modified',
              segments: [
                { type: 'unchanged', text: '姓名' },
                { type: 'added', text: '更新' },
              ],
            },
            {
              kind: 'tableCell',
              changeType: 'unchanged',
              segments: [{ type: 'unchanged', text: '年龄' }],
            },
          ],
        },
      ],
    }

    const { container } = render(<DiffBlockRenderer block={block} />)
    const cells = container.querySelectorAll('td')

    expect(cells[0].className).toContain('modified')
    expect(cells[1].className).toContain('unchanged')
  })
})
