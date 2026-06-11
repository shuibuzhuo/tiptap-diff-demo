# 当前 Diff 设计总结

## 目标

当前这版 diff 的目标不是做一个“全量富文本 AST 的完美对比器”，而是做一个更接近 Notion 版本预览体验的 **块级版本预览系统**：

- 先判断“哪一块变了”
- 再判断“块里面哪里变了”
- 富媒体和结构块尽量保留原始形态
- 右侧预览固定使用 `选中版本 vs 前一个版本`

这套设计优先保证：

- 可读性
- 结构不丢失
- 复杂块可扩展
- 在当前 demo 中最小改造

## 整体数据流

当前右侧 diff 的核心链路是：

`Tiptap JSON -> 标准块模型 -> 块匹配 -> 变更分类 -> 可渲染块 -> React 渲染`

对应模块如下：

- [src/lib/diff/types.ts](/Users/admin/Documents/temp/tiptap-diff-demo/src/lib/diff/types.ts:1)
  - 定义统一类型
- [src/lib/diff/normalize.ts](/Users/admin/Documents/temp/tiptap-diff-demo/src/lib/diff/normalize.ts:1)
  - 将 Tiptap JSON 归一化为块模型
- [src/lib/diff/engine.ts](/Users/admin/Documents/temp/tiptap-diff-demo/src/lib/diff/engine.ts:1)
  - 完成匹配、分类和 render block 生成
- [src/components/diff-block-renderer.tsx](/Users/admin/Documents/temp/tiptap-diff-demo/src/components/diff-block-renderer.tsx:1)
  - 按块类型渲染 diff 预览
- [src/components/version-preview.tsx](/Users/admin/Documents/temp/tiptap-diff-demo/src/components/version-preview.tsx:1)
  - 将 comparison 转成右侧预览

## 核心设计原则

### 1. 比较单位是“块”，不是整篇纯文本

这是当前设计最重要的一点。

文档先被拆成一个块列表，每个块再按自己的类型去比较和渲染。

这样做的好处是：

- 能保留标题、任务、表格、图片、分栏等不同语义
- 避免所有内容都退化成 `+/-` 文本
- 更接近 Notion 的“文档式预览”

### 2. 块内 diff 和块级 diff 分开

块级 diff 负责判断：

- `added`
- `removed`
- `modified`
- `unchanged`

块内 diff 只在需要时发生：

- 文本类块使用字符级 diff
- 表格在 cell 级别做字符级 diff
- 任务项同时比较文字和 `checked`
- 图片、分割线这类结构块不做字符级比较

### 3. 复杂块优先保留结构

当前不是把复杂块强行压成文本，而是尽量保留结构：

- `table` 保留为表格
- `columnGroup` 保留为双栏结构
- `imageBlock` 保留为图片区块
- `horizontalRule` 保留为结构块

## 当前支持的块类型

定义在 [src/lib/diff/types.ts](/Users/admin/Documents/temp/tiptap-diff-demo/src/lib/diff/types.ts:8)。

当前支持：

- `heading`
- `paragraph`
- `listItem`
- `taskItem`
- `blockquote`
- `codeBlock`
- `horizontalRule`
- `imageBlock`
- `table`
- `tableRow`
- `tableCell`
- `columnGroup`
- `column`

## 标准块模型

当前 diff 的统一块模型是 `DiffBlockModel`：

```ts
interface DiffBlockModel {
  kind: BlockKind
  text?: string
  attrs?: Record<string, unknown>
  children?: DiffBlockModel[]
  signature?: string
}
```

几个关键字段：

- `kind`
  - 决定比较和渲染逻辑
- `text`
  - 文本类块的主要比较内容
- `attrs`
  - 存块属性，比如 `checked`、`level`、`src`
- `children`
  - 复合块的内部结构，比如表格行列、分栏内容
- `signature`
  - 预留的轻量匹配辅助信息

## Normalize 设计

`normalizeDocument` 的职责是：

- 读取 Tiptap JSON
- 识别节点类型
- 转成统一的块结构

文件位置：

- [src/lib/diff/normalize.ts](/Users/admin/Documents/temp/tiptap-diff-demo/src/lib/diff/normalize.ts:3)

### 当前归一化策略

#### 文本类块

- `heading`
- `paragraph`
- `blockquote`
- `codeBlock`

会保留：

- `kind`
- `text`
- 部分关键属性，如 `level`、`language`

#### 列表与任务

- `bulletList` / `orderedList` / `taskList`
  - 不单独成块
  - 直接展开为内部的 `listItem` / `taskItem`

`taskItem` 额外保留：

- `attrs.checked`

#### 表格

`table` 会保留完整结构：

- `table`
  - `tableRow[]`
    - `tableCell[]`

当前每个 `tableCell` 会提取文本，用于后续 cell 级 diff。

#### 分栏

`columns` 会归一化为：

- `columnGroup`
  - `column[]`
    - 各列中的普通内容块

目前约束：

- 保留结构
- 每列按位置比较
- 当前不支持新增列、删列、换列

#### 图片

`imageBlock` 当前保留属性：

- `src`
- `width`
- `align`
- `ratio`

#### 分割线

`horizontalRule` 当前只作为结构块存在，不包含文本内容。

## 匹配设计

匹配逻辑在 [src/lib/diff/engine.ts](/Users/admin/Documents/temp/tiptap-diff-demo/src/lib/diff/engine.ts:12)。

当前不是最优匹配算法，而是一个 **顺序优先 + 小范围 lookahead** 的轻量策略。

### 匹配规则

1. 优先比较当前位置的前后两个块
2. 如果类型和规则允许匹配，则直接配对
3. 如果当前位置对不上，就向后看最多 3 个块
4. 找到可匹配块则把当前块判为新增或删除
5. 再继续向后比较

### 当前 `canMatch` 的关键规则

- `kind` 不同，直接不能匹配
- `horizontalRule`
  - 同类型即可匹配
- `imageBlock`
  - 同类型即可匹配
  - 具体是不是替换，交给后续分类处理
- `columnGroup`
  - 需要 `layout` 相同且列数一致
- `column`
  - 需要 `position` 相同

这个策略解决的问题是：

- 比纯索引更稳
- 中间插入一个块时，不会立刻把后面整段全部串掉

## 变更分类设计

分类逻辑在 [src/lib/diff/engine.ts](/Users/admin/Documents/temp/tiptap-diff-demo/src/lib/diff/engine.ts:87)。

统一变更类型是：

- `unchanged`
- `modified`
- `added`
- `removed`

### 文本类块

包括：

- `heading`
- `paragraph`
- `listItem`
- `blockquote`
- `codeBlock`
- `tableCell`

处理方式：

- 使用 `diffChars` 做字符级分段
- 只要文本或关键属性变了，就标记 `modified`

### 任务项

除了文本分段外，还比较：

- `attrs.checked`

只改勾选状态，也会是 `modified`。

### 容器块

包括：

- `table`
- `tableRow`
- `columnGroup`
- `column`

处理方式：

- 先递归比较 children
- 只要子块有变化，或容器 attrs 有变化，就标记 `modified`

### 图片块

图片块当前有专门分类逻辑：

- `src` 不同：
  - 视为 `replaced`
- 其他 attrs 改动：
  - 视为 `updated`
- 无变化：
  - `unchanged`

当前会在 `attrs` 里补充：

- `previousSrc`
- `imageChangeType`

用于渲染层展示“图片已替换”。

### 分割线

分割线不做块内 diff：

- 双边都存在时：`unchanged`
- 单边存在时：`added` / `removed`

## RenderBlock 设计

分类完成后，输出统一渲染结构 `RenderBlock`：

```ts
interface RenderBlock {
  kind: BlockKind
  changeType: ChangeType
  text?: string
  attrs?: Record<string, unknown>
  segments?: RenderSegment[]
  children?: RenderBlock[]
}
```

这里的核心是：

- 算法层只负责生成可渲染数据
- React 组件不需要知道原始 Tiptap JSON 细节

## 渲染设计

渲染逻辑在 [src/components/diff-block-renderer.tsx](/Users/admin/Documents/temp/tiptap-diff-demo/src/components/diff-block-renderer.tsx:7)。

当前按 `kind` 分支渲染：

- `heading`
- `listItem`
- `taskItem`
- `codeBlock`
- `blockquote`
- `horizontalRule`
- `imageBlock`
- `table`
- `columnGroup`
- 其他默认走段落

### 当前复杂块的表现方式

#### 图片

- 普通状态：
  - 显示当前图片
- `replaced`：
  - 显示 `图片已替换`
  - 并排展示旧版本和新版本图片

#### 分割线

- `added`：
  - 显示 `新增分割线`
- `removed`：
  - 显示 `已删除分割线`
- `unchanged`：
  - 只显示一条线

#### 表格

- 保留表格结构
- 每个 cell 内渲染自己的文本 segments
- 每个 `td` 会附带 `changeType` class
  - 用于高亮变更单元格

#### 分栏

- 保留双栏结构
- 每列内部递归渲染自己的 children

## 当前 UI 语义

### 左中右布局

- 左侧：文档与版本历史
- 中间：当前文档
- 右侧：版本对比预览

### 当前文档与版本历史

当前 demo 中已经拆成两个文档：

- 简单文档
  - 支持编辑和保存版本
- 复杂格式文档
  - 主要用于复杂块 diff 可视化验证
  - 当前中间区为静态预览，不走编辑器

文档数据在：

- [src/lib/documents.ts](/Users/admin/Documents/temp/tiptap-diff-demo/src/lib/documents.ts:1)

## 当前测试覆盖

当前已经有几类关键测试：

- `normalize`
  - 复杂块不会被压平成纯文本
- `engine`
  - 任务、表格、分栏的结构化 diff
  - 图片替换会生成替换语义
- `renderer`
  - 图片替换提示
  - 分割线新增/删除提示
  - 表格变更 cell 的样式钩子
- 文档历史
  - 两个文档各自有独立版本历史
  - 保存版本只作用于当前文档

## 当前已知边界

这版设计是“可用且可扩展”的基础版，不是最终版。当前边界包括：

### 1. 匹配仍然是轻量策略

不是复杂最优匹配算法。

已支持：

- 小范围 lookahead
- 中间插块的基础容错

还不擅长：

- 大规模搬块
- 远距离重排
- 跨类型内容迁移识别

### 2. 文本类块是字符级 diff

当前用 `diffChars`，优点是简单直接。

代价是：

- 某些长文本改动会比较碎
- 代码块目前还不是更适合代码阅读的行级 diff

### 3. 分栏当前有明确约束

当前只支持：

- 保留双栏结构
- 每列按位置比较

当前不支持：

- 新增列
- 删除列
- 交换列

### 4. 表格比较仍然偏朴素

当前按当前结构递归比较：

- 不做复杂表格重排识别
- 不做跨行跨列高级匹配

### 5. 行内 marks diff 还没展开

目前主要关注块级和纯文本内容变化。

像这些还没有单独设计：

- 粗体变化
- 链接变化
- 颜色变化
- 行内代码样式变化

### 6. 复杂文档中间区当前是静态预览

这是有意为之：

- 避免 StarterKit 吃掉复杂节点
- 先把复杂 diff 预览验证跑通

后续如果要支持复杂格式真正编辑，需要再补对应编辑器扩展。

## 为什么当前设计可继续演进

当前这版最重要的价值，不是“所有场景都已经完美”，而是已经把边界拆清楚了：

- `types`
  - 管统一结构
- `normalize`
  - 管节点识别
- `engine`
  - 管匹配和分类
- `renderer`
  - 管视觉表现

后续继续加能力时，基本可以按块类型逐个增强，而不用回头推翻整条链路。

比较自然的下一步包括：

- 代码块升级为行级 diff
- 表格增强为整行/整列语义
- taskItem 的状态变化视觉再强化
- 行内 marks 差异支持
- 更强的块匹配算法

## 一句话总结

当前这套 diff 设计的核心是：

**先把文档看成块列表，先比较块，再在块内比较文本；复杂块优先保留结构和语义，而不是全部压扁成纯文本。**
