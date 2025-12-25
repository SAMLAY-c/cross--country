"use client";

import { useState } from "react";
import ImageUpload from "@/components/image-upload";
import type { NoteForm } from "./types";

type Props = {
  form: NoteForm;
  onChange: (form: NoteForm) => void;
  onTitleChange: (title: string) => void;
  onSave: () => void;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
  onCloseError: () => void;
  onCloseSuccess: () => void;
};

/**
 * 元数据表单组件
 * 显示在编辑器顶部，包含标题、slug、分类等字段
 */
export default function NoteFormPanel({
  form,
  onChange,
  onTitleChange,
  onSave,
  saving,
  error,
  successMessage,
  onCloseError,
  onCloseSuccess,
}: Props) {
  const [showCoverUpload, setShowCoverUpload] = useState(false);

  return (
    <div className="border-b border-[#333333] bg-[#0a0a0a]/50 backdrop-blur-sm">
      {/* 错误提示 */}
      {error && (
        <div className="mx-4 mt-4 rounded-lg border border-red-400/40 bg-red-400/10 px-4 py-3 flex items-start justify-between">
          <p className="text-sm text-red-100">{error}</p>
          <button
            onClick={onCloseError}
            className="ml-4 text-red-200 hover:text-red-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* 成功提示 */}
      {successMessage && (
        <div className="mx-4 mt-4 rounded-lg border border-[var(--accent)] bg-[var(--accent-glow)] px-4 py-3 flex items-start justify-between">
          <p className="text-sm text-[var(--accent-contrast)] font-semibold">
            {successMessage}
          </p>
          <button
            onClick={onCloseSuccess}
            className="ml-4 text-[var(--accent-contrast)] hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      <div className="p-4 space-y-4">
        <div className="flex gap-4">
          {/* 标题 */}
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-[0.3em] text-white/45 mb-2">
              标题 *
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-[#333333] bg-white/[0.03] px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--accent)] transition"
              placeholder="输入笔记标题"
              value={form.title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>

          {/* Slug */}
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-[0.3em] text-white/45 mb-2">
              Slug *
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-[#333333] bg-white/[0.03] px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--accent)] transition"
              placeholder="url-friendly-slug"
              value={form.slug}
              onChange={(e) =>
                onChange({ ...form, slug: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex gap-4">
          {/* 分类 */}
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-[0.3em] text-white/45 mb-2">
              分类 *
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-[#333333] bg-white/[0.03] px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--accent)] transition"
              placeholder="提示词工程"
              value={form.category}
              onChange={(e) =>
                onChange({ ...form, category: e.target.value })
              }
            />
          </div>

          {/* 标签 */}
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-[0.3em] text-white/45 mb-2">
              标签 * (逗号分隔)
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-[#333333] bg-white/[0.03] px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--accent)] transition"
              placeholder="Few-shot, CoT, 智能体"
              value={form.tags}
              onChange={(e) => onChange({ ...form, tags: e.target.value })}
            />
          </div>
        </div>

        {/* 摘要 */}
        <div>
          <label className="block text-xs uppercase tracking-[0.3em] text-white/45 mb-2">
            摘要 (可选)
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-[#333333] bg-white/[0.03] px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--accent)] transition"
            placeholder="简短描述这条笔记..."
            value={form.summary}
            onChange={(e) => onChange({ ...form, summary: e.target.value })}
          />
        </div>

        {/* 封面图片和保存按钮 */}
        <div className="flex gap-4 items-start">
          {/* 封面图片上传 */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-[0.3em] text-white/45">
                封面图片 (可选)
              </label>
              <button
                onClick={() => setShowCoverUpload(!showCoverUpload)}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                {showCoverUpload ? "隐藏" : "显示"}
              </button>
            </div>
            {showCoverUpload && (
              <ImageUpload
                label="封面图片"
                value={form.cover_image}
                onChange={(url) => onChange({ ...form, cover_image: url })}
              />
            )}
            {form.cover_image && !showCoverUpload && (
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.cover_image}
                  alt="封面"
                  className="h-12 w-12 rounded object-cover border border-[#333333]"
                />
                <button
                  onClick={() => onChange({ ...form, cover_image: "" })}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  删除
                </button>
              </div>
            )}
          </div>

          {/* 保存按钮 */}
          <div className="flex items-end">
            <button
              onClick={onSave}
              disabled={saving}
              className={`rounded-lg px-6 py-2.5 text-sm font-semibold uppercase tracking-[0.25em] transition ${
                saving
                  ? "bg-white/20 text-white/50 cursor-not-allowed"
                  : "bg-[var(--accent)] text-[var(--accent-contrast)] hover:brightness-110"
              }`}
            >
              {saving ? "保存中..." : "保存"}
            </button>
          </div>
        </div>

        {/* 快捷键提示 */}
        <div className="text-xs text-white/30">
          提示：按 <kbd className="px-1.5 py-0.5 rounded bg-white/10">Cmd+S</kbd> 或{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-white/10">Ctrl+S</kbd> 快速保存
        </div>
      </div>
    </div>
  );
}
