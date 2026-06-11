export interface TiptapNode {
  type?: string
  text?: string
  attrs?: Record<string, unknown>
  marks?: Array<Record<string, unknown>>
  content?: TiptapNode[]
}

export type BlockKind =
  | 'heading'
  | 'paragraph'
  | 'listItem'
  | 'taskItem'
  | 'blockquote'
  | 'codeBlock'
  | 'horizontalRule'
  | 'imageBlock'
  | 'table'
  | 'tableRow'
  | 'tableCell'
  | 'columnGroup'
  | 'column'

export type ChangeType = 'unchanged' | 'modified' | 'added' | 'removed'

export interface DiffBlockModel {
  kind: BlockKind
  text?: string
  attrs?: Record<string, unknown>
  children?: DiffBlockModel[]
  signature?: string
}

export interface MatchedBlockPair {
  previous?: DiffBlockModel
  current?: DiffBlockModel
}

export interface RenderSegment {
  type: 'added' | 'removed' | 'unchanged'
  text: string
}

export interface RenderBlock {
  kind: BlockKind
  changeType: ChangeType
  text?: string
  attrs?: Record<string, unknown>
  segments?: RenderSegment[]
  children?: RenderBlock[]
}
