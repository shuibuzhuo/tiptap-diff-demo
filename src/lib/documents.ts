import type { TiptapNode } from './diff'
import { createVersionRecord, type VersionRecord } from './versioning'

export interface DocumentRecord {
  id: string
  title: string
  description: string
  editable: boolean
  versions: VersionRecord[]
}

const simpleLatestContent = JSON.parse(
  '{"type":"doc","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"划水AI","marks":[{"type":"bold","attrs":{}}]},{"type":"text","text":" 是 Node 全栈开发的 AIGC 知识库平台，像国内的腾讯文档、语雀，国外的 Notion 。"}]},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"它包括文档管理、富文本编辑器、"},{"type":"text","text":"多人协同编辑","marks":[{"type":"bold","attrs":{}}]},{"type":"text","text":"，还有 "},{"type":"text","text":"AI 智能写作、AI 优化文字、AI 聊天","marks":[{"type":"bold","attrs":{}}]},{"type":"text","text":"等 100+ 功能。"}]},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"复杂项目，真实上线，非课程 demo 。已有 4000+ 用户注册使用。"}]},{"type":"heading","attrs":{"textAlign":"left","level":2},"content":[{"type":"text","text":"5 大技术亮点"}]},{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"专门为"},{"type":"text","text":"前端同学","marks":[{"type":"bold","attrs":{}}]},{"type":"text","text":"打造，转型"},{"type":"text","text":"全栈","marks":[{"type":"bold","attrs":{}}]},{"type":"text","text":"开发，项目 5 大技术亮点，学完打动"},{"type":"text","text":"面试官","marks":[{"type":"bold","attrs":{}}]},{"type":"text","text":"："}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"Node.js 全栈能力：Next.js 框架，Prisma PostgreSQL 数据库，从此不再是纯前端、切图仔"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"复杂项目的架构设计能力，项目有 100+ 功能，从 0 设计、开发并发布上线"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":"left"},"content":[{"type":"text","text":"超越 99% 前端的技术难度：富文本编辑器，多人协同编辑"}]}]}]},{"type":"paragraph","attrs":{"textAlign":"left"}}]}',
) as TiptapNode

const simpleMiddleContent = {
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

const simpleFirstDraftContent = {
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

const complexLatestContent = {
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '复杂格式文档' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '一段文字更新' }] },
    {
      type: 'bulletList',
      content: [
        { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '花朵更新' }] }] },
        { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '小鸟' }] }] },
        { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '舞蹈' }] }] },
      ],
    },
    {
      type: 'taskList',
      content: [
        { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '计划1更新' }] }] },
        { type: 'taskItem', attrs: { checked: true }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '计划2' }] }] },
        { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '计划3' }] }] },
      ],
    },
    {
      type: 'blockquote',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: '一段引用更新' }] }],
    },
    {
      type: 'codeBlock',
      attrs: { language: 'javascript' },
      content: [{ type: 'text', text: "console.log('hello')更新" }],
    },
    {
      type: 'table',
      content: [
        {
          type: 'tableRow',
          content: [
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '姓名更新' }] }] },
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '年龄' }] }] },
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '城市' }] }] },
          ],
        },
        {
          type: 'tableRow',
          content: [
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '张三' }] }] },
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '20更新' }] }] },
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '北京' }] }] },
          ],
        },
        {
          type: 'tableRow',
          content: [
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '李四' }] }] },
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '30' }] }] },
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '上海更新' }] }] },
          ],
        },
      ],
    },
    {
      type: 'imageBlock',
      attrs: { src: 'https://picsum.photos/seed/tiptap-diff-new/960/560', width: '75%', ratio: 1.71, align: 'center' },
    },
    {
      type: 'columns',
      attrs: { layout: 'two-column' },
      content: [
        { type: 'column', attrs: { position: 'left' }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '第一列更新' }] }] },
        { type: 'column', attrs: { position: 'right' }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '第二列' }] }] },
      ],
    },
    { type: 'paragraph', content: [{ type: 'text', text: '分割线前的内容更新' }] },
    { type: 'horizontalRule' },
    { type: 'paragraph', content: [{ type: 'text', text: '分割线后的内容' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '分割线更新' }] },
  ],
} as TiptapNode

const complexMiddleContent = {
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '复杂格式文档' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '一段文字' }] },
    {
      type: 'bulletList',
      content: [
        { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '花朵' }] }] },
        { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '小鸟' }] }] },
        { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '舞蹈' }] }] },
      ],
    },
    {
      type: 'taskList',
      content: [
        { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '计划1' }] }] },
        { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '计划2' }] }] },
        { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '计划3' }] }] },
      ],
    },
    {
      type: 'blockquote',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: '一段引用' }] }],
    },
    {
      type: 'codeBlock',
      attrs: { language: 'javascript' },
      content: [{ type: 'text', text: "console.log('hello')" }],
    },
    {
      type: 'table',
      content: [
        {
          type: 'tableRow',
          content: [
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '姓名' }] }] },
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '年龄' }] }] },
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '城市' }] }] },
          ],
        },
        {
          type: 'tableRow',
          content: [
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '张三' }] }] },
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '20' }] }] },
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '北京' }] }] },
          ],
        },
        {
          type: 'tableRow',
          content: [
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '李四' }] }] },
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '30' }] }] },
            { type: 'tableCell', content: [{ type: 'paragraph', content: [{ type: 'text', text: '上海' }] }] },
          ],
        },
      ],
    },
    {
      type: 'imageBlock',
      attrs: { src: 'https://picsum.photos/seed/tiptap-diff-old/960/560', width: '75%', ratio: 1.71, align: 'center' },
    },
    {
      type: 'columns',
      attrs: { layout: 'two-column' },
      content: [
        { type: 'column', attrs: { position: 'left' }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '第一列' }] }] },
        { type: 'column', attrs: { position: 'right' }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '第二列' }] }] },
      ],
    },
    { type: 'paragraph', content: [{ type: 'text', text: '分割线前的内容' }] },
    { type: 'horizontalRule' },
    { type: 'paragraph', content: [{ type: 'text', text: '分割线后的内容' }] },
  ],
} as TiptapNode

const complexFirstDraftContent = {
  type: 'doc',
  content: [
    { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: '复杂格式文档（初稿）' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '先确认复杂块预览的基础样例。' }] },
    {
      type: 'bulletList',
      content: [
        { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '普通段落' }] }] },
        { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '表格与图片待补' }] }] },
      ],
    },
    {
      type: 'taskList',
      content: [{ type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '补充任务列表案例' }] }] }],
    },
    {
      type: 'columns',
      attrs: { layout: 'two-column' },
      content: [
        { type: 'column', attrs: { position: 'left' }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '第一列草稿' }] }] },
        { type: 'column', attrs: { position: 'right' }, content: [{ type: 'paragraph', content: [{ type: 'text', text: '第二列草稿' }] }] },
      ],
    },
  ],
} as TiptapNode

export const mockDocuments: DocumentRecord[] = [
  {
    id: 'doc-simple',
    title: '简单文档',
    description: '延续原来的纯文本与列表示例，支持中间区直接编辑。',
    editable: true,
    versions: [
      { id: 'v1', author: '当前用户', createdAt: '2026-06-08 10:30', content: simpleLatestContent },
      { id: 'v2', author: '当前用户', createdAt: '2026-06-08 09:12', content: simpleMiddleContent },
      { id: 'v3', author: '当前用户', createdAt: '2026-06-07 22:05', content: simpleFirstDraftContent },
    ],
  },
  {
    id: 'doc-complex',
    title: '复杂格式文档',
    description: '用于验证任务列表、引用、代码块、表格、图片和分栏的复杂 diff。',
    editable: false,
    versions: [
      { id: 'v1', author: '当前用户', createdAt: '2026-06-11 15:30', content: complexLatestContent },
      { id: 'v2', author: '当前用户', createdAt: '2026-06-11 14:48', content: complexMiddleContent },
      { id: 'v3', author: '当前用户', createdAt: '2026-06-11 13:20', content: complexFirstDraftContent },
    ],
  },
]

export function saveVersionToDocuments(documents: DocumentRecord[], activeDocumentId: string, content: TiptapNode) {
  return documents.map((document) => {
    if (document.id !== activeDocumentId) return document

    const nextVersion = createVersionRecord(content, document.versions.length + 1)
    return {
      ...document,
      versions: [nextVersion, ...document.versions],
    }
  })
}
