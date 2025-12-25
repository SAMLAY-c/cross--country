"use client";

import { useState, useCallback, useEffect } from "react";
import { apiRequest, generateSlug } from "./api-utils";
import type { LearningNote, NoteForm, ViewMode } from "./types";
import NotesListPanel from "./notes-list-panel";
import NoteFormPanel from "./note-form";
import MarkdownToolbar from "./markdown-toolbar";
import MarkdownPreview from "./markdown-preview";

const initialForm: NoteForm = {
  title: "",
  slug: "",
  category: "",
  summary: "",
  tags: "",
  cover_image: "",
  content: "",
};

/**
 * 主编辑器组件
 */
export default function LearningNotesEditor({
  initialNotes,
}: {
  initialNotes: LearningNote[];
}) {
  const [notes, setNotes] = useState<LearningNote[]>(initialNotes);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<NoteForm>(initialForm);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedNote = notes.find((n) => n.id === selectedId);

  /**
   * 选择笔记进行编辑
   */
  const handleSelectNote = useCallback((note: LearningNote) => {
    setSelectedId(note.id);
    setForm({
      title: note.title,
      slug: note.slug,
      category: note.category,
      summary: note.summary || "",
      tags: note.tags.join(", "),
      cover_image: note.coverImage || "",
      content: note.content || "",
    });
    setError(null);
    setSuccessMessage(null);
  }, []);

  /**
   * 创建新笔记
   */
  const handleCreateNew = useCallback(() => {
    setSelectedId(null);
    setForm(initialForm);
    setViewMode("split");
    setError(null);
    setSuccessMessage(null);
  }, []);

  /**
   * 保存笔记
   */
  const handleSave = async () => {
    setError(null);
    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        category: form.category.trim(),
        summary: form.summary.trim() || null,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        cover_image: form.cover_image.trim() || null,
        content: form.content,
      };

      // 验证必填字段
      if (!payload.title || !payload.slug || !payload.category || !payload.content) {
        setError("标题、Slug、分类和内容为必填项");
        return;
      }

      if (payload.tags.length === 0) {
        setError("至少需要一个标签");
        return;
      }

      if (selectedId) {
        // 更新现有笔记
        await apiRequest(`/api/learning-notes/${selectedId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setSuccessMessage("保存成功！");
      } else {
        // 创建新笔记
        const response = await apiRequest<{ id: number }>(
          `/api/learning-notes`,
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );
        setSelectedId(response.id);
        setSuccessMessage("创建成功！");
      }

      // 重新加载笔记列表
      const responseData = await apiRequest<{ learning_notes: LearningNote[] }>(
        `/api/learning-notes`
      );
      setNotes(responseData.learning_notes);

      // 3秒后清除成功消息
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  /**
   * 删除笔记
   */
  const handleDelete = async (id: number) => {
    if (!confirm("确认删除这条笔记？")) return;

    try {
      await apiRequest(`/api/learning-notes/${id}`, { method: "DELETE" });

      if (selectedId === id) {
        setSelectedId(null);
        setForm(initialForm);
      }

      setNotes((prev) => prev.filter((n) => n.id !== id));
      setSuccessMessage("删除成功！");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除失败");
    }
  };

  /**
   * 当标题变化时自动生成 slug
   */
  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  /**
   * 处理内容变化
   */
  const handleContentChange = (value: string) => {
    setForm((prev) => ({ ...prev, content: value }));
  };

  /**
   * 插入 Markdown 到光标位置
   */
  const handleInsertMarkdown = (markdown: string) => {
    const textarea = document.getElementById(
      "markdown-textarea"
    ) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = form.content.substring(0, start);
      const after = form.content.substring(end);
      handleContentChange(before + markdown + after);

      // 恢复光标位置
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd =
          start + markdown.length;
        textarea.focus();
      }, 0);
    }
  };

  /**
   * 键盘快捷键
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+S / Ctrl+S 保存
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [form, selectedId, handleSave]);

  /**
   * 处理拖拽排序
   */
  const handleReorder = async (reorderedNotes: LearningNote[]) => {
    try {
      // 更新本地状态
      setNotes(reorderedNotes);

      // 调用批量排序 API
      const reorderData = reorderedNotes.map((note, index) => ({
        id: note.id,
        order_index: index,
      }));

      await apiRequest("/api/learning-notes/batch", {
        method: "PATCH",
        body: JSON.stringify({ action: "reorder", data: reorderData }),
      });

      setSuccessMessage("排序已保存");
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "排序失败");
      // 恢复原顺序
      setNotes(notes);
    }
  };

  return (
    <div className="flex h-screen">
      {/* 左侧笔记列表面板 */}
      <aside className="w-80 border-r border-[#333333] bg-[#0a0a0a] overflow-y-auto flex-shrink-0">
        <NotesListPanel
          notes={notes}
          selectedId={selectedId}
          onSelect={handleSelectNote}
          onNew={handleCreateNew}
          onDelete={handleDelete}
          onReorder={handleReorder}
          categories={Array.from(new Set(notes.map((n) => n.category)))}
        />
      </aside>

      {/* 主编辑区域 */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* 元数据表单 */}
        <NoteFormPanel
          form={form}
          onChange={setForm}
          onTitleChange={handleTitleChange}
          onSave={handleSave}
          saving={saving}
          error={error}
          successMessage={successMessage}
          onCloseError={() => setError(null)}
          onCloseSuccess={() => setSuccessMessage(null)}
        />

        {/* Markdown 编辑器 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 工具栏 */}
          <MarkdownToolbar onInsert={handleInsertMarkdown} />

          {/* 编辑器/预览 分栏 */}
          {viewMode !== "preview" && (
            <div className={viewMode === "split" ? "w-1/2" : "w-full"}>
              <textarea
                id="markdown-textarea"
                className="w-full h-full bg-[#0a0a0a] text-[#a1a1aa] p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                value={form.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="开始写 Markdown...&#10;&#10;# 示例标题&#10;&#10;这是一段**粗体文本**和*斜体文本*。&#10;&#10;- 列表项 1&#10;- 列表项 2&#10;&#10;```javascript&#10;console.log('Hello World');&#10;```"
                spellCheck={false}
              />
            </div>
          )}

          {viewMode !== "edit" && (
            <div
              className={
                viewMode === "split"
                  ? "w-1/2 border-l border-[#333333]"
                  : "w-full"
              }
            >
              <MarkdownPreview content={form.content} />
            </div>
          )}
        </div>

        {/* 视图模式切换 */}
        <div className="border-t border-[#333333] p-2 flex justify-center gap-2 bg-[#0a0a0a]">
          {(["edit", "split", "preview"] as const).map((mode) => (
            <button
              key={mode}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.25em] transition ${
                viewMode === mode
                  ? "bg-[var(--accent)] text-[var(--accent-contrast)]"
                  : "bg-white/10 text-white/70 hover:bg-white/16"
              }`}
              onClick={() => setViewMode(mode)}
            >
              {mode === "edit" ? "编辑" : mode === "preview" ? "预览" : "分栏"}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
