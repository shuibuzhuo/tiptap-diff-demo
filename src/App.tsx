import { useEffect, useMemo, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import type { JSONContent } from '@tiptap/react'
import './App.css'
import { mockDocuments, saveVersionToDocuments } from './lib/documents'
import { getPreviewComparison } from './lib/versioning'
import VersionPreview from './components/version-preview'
import DocumentContentPreview from './components/document-content-preview'

const initialDocument = mockDocuments[0]
const initialVersion = initialDocument.versions[0]

function App() {
  const [documents, setDocuments] = useState(mockDocuments)
  const [activeDocumentId, setActiveDocumentId] = useState(initialDocument.id)
  const [activeVersionId, setActiveVersionId] = useState(initialVersion.id)
  const [currentDoc, setCurrentDoc] = useState<JSONContent>(initialVersion.content as JSONContent)
  const activeDocument = documents.find((document) => document.id === activeDocumentId) || documents[0]
  const versions = activeDocument.versions
  const activeVersion = versions.find((version) => version.id === activeVersionId) || versions[0]

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialVersion.content as JSONContent,
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

  useEffect(() => {
    if (!editor || !activeDocument.editable) return
    editor.commands.setContent(activeVersion.content as JSONContent)
  }, [activeDocument.editable, activeVersion.content, editor])

  function handleSaveVersion() {
    if (!editor || !activeDocument.editable) return

    const nextDocuments = saveVersionToDocuments(documents, activeDocument.id, editor.getJSON())
    const nextActiveDocument = nextDocuments.find((document) => document.id === activeDocument.id) || activeDocument
    setDocuments(nextDocuments)
    setActiveVersionId(nextActiveDocument.versions[0].id)
  }

  function handleSelectDocument(documentId: string) {
    const nextDocument = documents.find((document) => document.id === documentId)
    if (!nextDocument) return

    setActiveDocumentId(documentId)
    setActiveVersionId(nextDocument.versions[0].id)
    setCurrentDoc(nextDocument.versions[0].content as JSONContent)
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
            <h2>文档与版本</h2>
            <span>{documents.length} 个文档</span>
          </div>
          <div className="document-list">
            {documents.map((document) => {
              const isActive = document.id === activeDocumentId
              return (
                <button
                  key={document.id}
                  type="button"
                  className={`document-item${isActive ? ' active' : ''}`}
                  onClick={() => handleSelectDocument(document.id)}
                >
                  <strong>{document.title}</strong>
                  <span>{document.description}</span>
                </button>
              )
            })}
          </div>
          <div className="version-subheader">
            <strong>{activeDocument.title}</strong>
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
              <span>{activeDocument.editable ? '可直接编辑' : '复杂文档当前仅做预览验证'}</span>
              <button
                type="button"
                className="save-version-button"
                onClick={handleSaveVersion}
                disabled={!editor || !activeDocument.editable}
              >
                保存版本
              </button>
            </div>
          </div>
          <div className="editor-shell">
            {activeDocument.editable ? (
              <EditorContent editor={editor} />
            ) : (
              <DocumentContentPreview document={activeVersion.content} />
            )}
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
