import { useMemo, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import type { JSONContent } from '@tiptap/react'
import './App.css'
import { mockVersions } from './lib/mock-versions'
import { createVersionRecord, getPreviewComparison } from './lib/versioning'
import VersionPreview from './components/version-preview'

function App() {
  const [versions, setVersions] = useState(mockVersions)
  const [activeVersionId, setActiveVersionId] = useState(mockVersions[0].id)
  const [currentDoc, setCurrentDoc] = useState<JSONContent>(mockVersions[0].content as JSONContent)
  const activeVersion = versions.find((version) => version.id === activeVersionId) || versions[0]

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

  const previewComparison = useMemo(
    () => getPreviewComparison(versions, activeVersionId, currentDoc),
    [activeVersionId, currentDoc, versions],
  )

  function handleSaveVersion() {
    if (!editor) return

    const nextVersion = createVersionRecord(editor.getJSON(), versions.length + 1)
    setVersions((prev) => [nextVersion, ...prev])
    setActiveVersionId(nextVersion.id)
  }

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Tiptap Diff Demo</p>
          <h1>历史版本 vs 当前文档</h1>
          <p className="subtitle">中间持续编辑当前草稿，左侧保存历史版本，右侧固定预览“选中版本 vs 前一个版本”的差异。</p>
        </div>
      </header>

      <section className="layout">
        <aside className="panel version-panel">
          <div className="panel-header">
            <h2>历史版本</h2>
            <span>{versions.length} 个版本</span>
          </div>
          <div className="version-list">
            {versions.map((version) => {
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
            <div className="editor-actions">
              <span>可直接编辑</span>
              <button type="button" className="save-version-button" onClick={handleSaveVersion} disabled={!editor}>
                保存版本
              </button>
            </div>
          </div>
          <div className="editor-shell">
            <EditorContent editor={editor} />
          </div>
        </section>

        <aside className="panel diff-panel">
          <div className="panel-header">
            <h2>对比预览</h2>
            <span>
              {activeVersion.author} · {activeVersion.createdAt}
            </span>
          </div>
          <VersionPreview comparison={previewComparison} />
        </aside>
      </section>
    </main>
  )
}

export default App
