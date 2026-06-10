import type { TiptapNode } from './diff'

const defaultVersionContent = JSON.parse(
  '{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"划水AI","marks":[{"type":"bold","attrs":{}}]},{"type":"text","text":" 是 Node 全栈开发的 AIGC 知识库平台，像国内的腾讯文档、语雀，国外的 Notion 。"}]},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"它包括文档管理、富文本编辑器、"},{"type":"text","text":"多人协同编辑","marks":[{"type":"bold","attrs":{}}]},{"type":"text","text":"，还有 "},{"type":"text","text":"AI 智能写作、AI 优化文字、AI 聊天","marks":[{"type":"bold","attrs":{}}]},{"type":"text","text":"等 100+ 功能。"}]},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"复杂项目，真实上线，非课程 demo 。已有 4000+ 用户注册使用。"}]},{"type":"heading","attrs":{"textAlign":"left","level":2},"content":[{"type":"text","text":"5 大技术亮点"}]},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"专门为"},{"type":"text","text":"前端同学","marks":[{"type":"bold","attrs":{}}]},{"type":"text","text":"打造，转型"},{"type":"text","text":"全栈","marks":[{"type":"bold","attrs":{}}]},{"type":"text","text":"开发，项目 5 大技术亮点，学完打动"},{"type":"text","text":"面试官","marks":[{"type":"bold","attrs":{}}]},{"type":"text","text":"："}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"Node.js 全栈能力：Next.js 框架，Prisma PostgreSQL 数据库，从此不再是纯前端、切图仔"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"复杂项目的架构设计能力，项目有 100+ 功能，从 0 设计、开发并发布上线"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"超越 99% 前端的技术难度：富文本编辑器，多人协同编辑"}]}]}]},{"type":"paragraph","attrs":{"textAlign":"left"}}]}',
) as TiptapNode

export interface VersionRecord {
  id: string
  author: string
  createdAt: string
  content: TiptapNode
}

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
    content: {
      ...defaultVersionContent,
      content: [
        ...(defaultVersionContent.content || []).slice(0, 2),
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '这一版还没有补充“版本记录”相关能力说明。' }],
        },
      ],
    },
  },
  {
    id: 'v3',
    author: '当前用户',
    createdAt: '2026-06-07 22:05',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: '划水 AI 项目介绍' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '这是更早的版本，内容结构更精简。' }],
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
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '支持协同写作' }] }],
            },
          ],
        },
      ],
    },
  },
]

console.log(mockVersions)
