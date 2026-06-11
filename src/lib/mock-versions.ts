import type { TiptapNode } from './diff'
import type { VersionRecord } from './versioning'

const defaultVersionContent = JSON.parse(
  '{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"划水AI","marks":[{"type":"bold","attrs":{}}]},{"type":"text","text":" 是 Node 全栈开发的 AIGC 知识库平台，像国内的腾讯文档、语雀，国外的 Notion 。"}]},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"它包括文档管理、富文本编辑器、"},{"type":"text","text":"多人协同编辑","marks":[{"type":"bold","attrs":{}}]},{"type":"text","text":"，还有 "},{"type":"text","text":"AI 智能写作、AI 优化文字、AI 聊天","marks":[{"type":"bold","attrs":{}}]},{"type":"text","text":"等 100+ 功能。"}]},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"复杂项目，真实上线，非课程 demo 。已有 4000+ 用户注册使用。"}]},{"type":"heading","attrs":{"textAlign":"left","level":2},"content":[{"type":"text","text":"5 大技术亮点"}]},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"专门为"},{"type":"text","text":"前端同学","marks":[{"type":"bold","attrs":{}}]},{"type":"text","text":"打造，转型"},{"type":"text","text":"全栈","marks":[{"type":"bold","attrs":{}}]},{"type":"text","text":"开发，项目 5 大技术亮点，学完打动"},{"type":"text","text":"面试官","marks":[{"type":"bold","attrs":{}}]},{"type":"text","text":"："}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"Node.js 全栈能力：Next.js 框架，Prisma PostgreSQL 数据库，从此不再是纯前端、切图仔"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"复杂项目的架构设计能力，项目有 100+ 功能，从 0 设计、开发并发布上线"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"超越 99% 前端的技术难度：富文本编辑器，多人协同编辑"}]}]}]},{"type":"paragraph","attrs":{"textAlign":"left"}}]}',
) as TiptapNode

const middleVersionContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      attrs: { textAlign: 'left' },
      content: [
        { type: 'text', text: '划水AI', marks: [{ type: 'bold', attrs: {} }] },
        { type: 'text', text: ' 是一个面向前端工程师的 Node 全栈 AIGC 知识库平台，整体形态接近 Notion。' },
      ],
    },
    {
      type: 'paragraph',
      attrs: { textAlign: 'left' },
      content: [
        { type: 'text', text: '当前已经包含文档管理、富文本编辑器、' },
        { type: 'text', text: '多人协同编辑', marks: [{ type: 'bold', attrs: {} }] },
        { type: 'text', text: '，以及 ' },
        { type: 'text', text: 'AI 写作、AI 优化、AI 聊天', marks: [{ type: 'bold', attrs: {} }] },
        { type: 'text', text: ' 等核心能力。' },
      ],
    },
    {
      type: 'paragraph',
      attrs: { textAlign: 'left' },
      content: [{ type: 'text', text: '这一版先把产品定位和主要功能补齐，案例数据与亮点说明还在整理。' }],
    },
    {
      type: 'heading',
      attrs: { textAlign: 'left', level: 2 },
      content: [{ type: 'text', text: '技术亮点（草稿）' }],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: { textAlign: 'left' },
              content: [{ type: 'text', text: 'Next.js + Prisma + PostgreSQL 的全栈项目实践。' }],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: { textAlign: 'left' },
              content: [{ type: 'text', text: '包含富文本编辑器和多人协同编辑等复杂模块。' }],
            },
          ],
        },
      ],
    },
  ],
} as TiptapNode

const firstDraftContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: '划水 AI 项目介绍' }],
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: '先记录一个简版介绍，后面再补完整卖点和案例数据。' }],
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: '项目方向：做一个带 AI 能力的知识库平台，支持文档编辑和团队协作。' }],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '支持富文本编辑' }] }],
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '支持多人协作' }] }],
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '准备补充 AI 写作相关能力' }] }],
        },
      ],
    },
  ],
} as TiptapNode

export const mockVersions: VersionRecord[] = [
  {
    id: 'v1',
    author: '当前用户',
    createdAt: '2026-06-08 10:30',
    content: defaultVersionContent,
  },
  {
    id: 'v2',
    author: '当前用户',
    createdAt: '2026-06-08 09:12',
    content: middleVersionContent,
  },
  {
    id: 'v3',
    author: '当前用户',
    createdAt: '2026-06-07 22:05',
    content: firstDraftContent,
  },
]
