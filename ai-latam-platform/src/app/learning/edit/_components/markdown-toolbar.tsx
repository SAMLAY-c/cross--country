"use client";

import { useState } from "react";
import ImageUpload from "@/components/image-upload";

type ToolbarAction = {
  label: string;
  icon: string;
  insert: (selectedText?: string) => string;
  shortcut: string;
};

const toolbarActions: ToolbarAction[] = [
  { label: "加粗", icon: "**B**", insert: (text) => `**${text || "粗体文本"}**`, shortcut: "Cmd+B" },
  { label: "斜体", icon: "*I*", insert: (text) => `*${text || "斜体文本"}*`, shortcut: "Cmd+I" },
  { label: "代码", icon: "</>", insert: (text) => `\`${text || "代码"}\``, shortcut: "Cmd+`" },
  { label: "代码块", icon: "{}", insert: () => "```\n代码块\n```", shortcut: "Cmd+Shift+C" },
  { label: "标题", icon: "H2", insert: () => "## 标题", shortcut: "Cmd+H" },
  { label: "链接", icon: "🔗", insert: (text) => `[${text || "链接文本"}](url)`, shortcut: "Cmd+K" },
  { label: "列表", icon: "•", insert: () => "- 列表项", shortcut: "Cmd+L" },
  { label: "引用", icon: ">", insert: () => "> 引用", shortcut: "Cmd+Shift+." },
];

type Props = {
  onInsert: (markdown: string) => void;
};

/**
 * Markdown 工具栏组件
 * 提供快捷插入按钮和图片上传功能
 */
export default function MarkdownToolbar({ onInsert }: Props) {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleInsertImage = () => {
    if (imageUrl) {
      onInsert(`![图片描述](${imageUrl})`);
      setShowImageUpload(false);
      setImageUrl("");
    }
  };

  return (
    <>
      <div className="w-16 border-r border-[#333333] bg-[#0a0a0a] flex flex-col items-center py-4 gap-2 flex-shrink-0">
        {toolbarActions.map((action) => (
          <button
            key={action.label}
            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold flex items-center justify-center transition"
            title={`${action.label} (${action.shortcut})`}
            onClick={() => onInsert(action.insert())}
          >
            {action.icon}
          </button>
        ))}

        <div className="w-8 h-px bg-[#333333] my-2" />

        <button
          className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-sm flex items-center justify-center transition"
          title="插入图片"
          onClick={() => setShowImageUpload(!showImageUpload)}
        >
          🖼️
        </button>
      </div>

      {/* 图片上传弹窗 */}
      {showImageUpload && (
        <div className="fixed left-20 top-20 z-50 rounded-xl border border-[#333333] bg-[#121212] p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">插入图片</h3>
            <button
              onClick={() => setShowImageUpload(false)}
              className="text-white/50 hover:text-white"
            >
              ✕
            </button>
          </div>

          <ImageUpload
            label="上传图片"
            value={imageUrl}
            onChange={setImageUrl}
          />

          <div className="flex gap-2 mt-4">
            <button
              className="flex-1 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-contrast)] hover:brightness-110 transition"
              onClick={handleInsertImage}
              disabled={!imageUrl}
            >
              插入
            </button>
            <button
              className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5 transition"
              onClick={() => setShowImageUpload(false)}
            >
              取消
            </button>
          </div>
        </div>
      )}
    </>
  );
}
