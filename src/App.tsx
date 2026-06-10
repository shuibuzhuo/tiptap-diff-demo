import { useMemo, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import type { JSONContent } from '@tiptap/react'
import './App.css'
import { buildDiffLines } from './lib/diff'
import { mockVersions } from './lib/mock-versions'

function App() {
  const [activeVersionId, setActiveVersionId] = useState(mockVersions[0].id)
  const [currentDoc, setCurrentDoc] = useState<JSONContent>(mockVersions[0].content as JSONContent)
  const activeVersion = mockVersions.find((version) => version.id === activeVersionId) || mockVersions[0]

  const editor = useEditor({
    extensions: [StarterKit],
    content: mockVersions[0].content as JSONContent,
    immediatelyRender: false,
    onCreate: ({ editor: nextEditor }) => {
      setCurrentDoc(nextEditor.getJSON())
    },
    onUpdate: ({ editor: nextEditor }) => {
      setCurrentDoc(nextEditor.getJSON())
    },
  })

  const diffLines = useMemo(() => buildDiffLines(activeVersion.content, currentDoc), [activeVersion, currentDoc])

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Tiptap Diff Demo</p>
          <h1>历史版本 vs 当前文档</h1>
          <p className="subtitle">左侧选择历史版本，中间直接编辑当前文档，右侧实时展示纯文本行级 diff。</p>
        </div>
      </header>

      <section className="layout">
        <aside className="panel version-panel">
          <div className="panel-header">
            <h2>历史版本</h2>
            <span>{mockVersions.length} 个版本</span>
          </div>
          <div className="version-list">
            {mockVersions.map((version) => {
              const isActive = version.id === activeVersionId
              return (
                <button
                  key={version.id}
                  type="button"
                  className={`version-item${isActive ? ' active' : ''}`}
                  onClick={() => setActiveVersionId(version.id)}
                >
                  <strong>{version.author}</strong>
                  <span>{version.createdAt}</span>
                </button>
              )
            })}
          </div>
        </aside>

        <section className="panel editor-panel">
          <div className="panel-header">
            <h2>当前文档</h2>
            <span>可直接编辑</span>
          </div>
          <div className="editor-shell">
            <EditorContent editor={editor} />
          </div>
        </section>

        <aside className="panel diff-panel">
          <div className="panel-header">
            <h2>内容 Diff</h2>
            <span>
              {activeVersion.author} · {activeVersion.createdAt}
            </span>
          </div>
          <div className="diff-list">
            {diffLines.map((line, index) => (
              <div key={`${line.type}-${index}-${line.text.slice(0, 12)}`} className={`diff-line ${line.type}`}>
                <span className="prefix">{line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}</span>
                <span>{line.text}</span>
              </div>
            ))}
            {diffLines.length === 0 && <div className="diff-empty">当前内容与所选历史版本没有差异。</div>}
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
