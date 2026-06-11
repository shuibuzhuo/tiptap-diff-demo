# Tiptap Diff Demo

一个基于 `React + Vite + Tiptap` 的版本对比示例项目。

在线预览：

- GitHub Pages: https://shuibuzhuo.github.io/tiptap-diff-demo/

核心体验：

- 左侧选择文档和历史版本
- 中间编辑当前文档并保存新版本
- 右侧预览“当前选中版本 vs 前一个版本”的差异

当前 diff 方案以“块级对比”为主，不追求完整 AST 精确比对，更强调结构可读性和预览效果。

## 启动

```bash
pnpm install
pnpm dev
```

常用命令：

```bash
pnpm test
pnpm lint
pnpm build
```

## 目录

- `src/App.tsx`：页面主流程，串联文档、编辑器和对比预览
- `src/lib/diff/`：diff 归一化、匹配和类型定义
- `src/components/`：版本预览、文档预览和 diff 渲染组件
- `src/lib/documents.ts`：mock 文档与版本保存逻辑
- `docs/current-diff-design.md`：当前 diff 设计说明
