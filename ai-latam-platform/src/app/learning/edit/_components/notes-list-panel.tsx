"use client";

import { useState, useMemo } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { LearningNote } from "./types";

type Props = {
  notes: LearningNote[];
  selectedId: number | null;
  onSelect: (note: LearningNote) => void;
  onNew: () => void;
  onDelete: (id: number) => void;
  onReorder: (notes: LearningNote[]) => void;
  categories: string[];
};

/**
 * 可排序的笔记卡片组件
 */
function SortableNoteItem({
  note,
  selectedId,
  selectedIds,
  onSelect,
  onToggleSelect,
}: {
  note: LearningNote;
  selectedId: number | null;
  selectedIds: Set<number>;
  onSelect: (note: LearningNote) => void;
  onToggleSelect: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`rounded-lg border p-3 cursor-pointer transition ${
          selectedId === note.id
            ? "border-[var(--accent)] bg-[var(--accent-glow)]"
            : "border-[#333333] bg-white/3 hover:border-white/20"
        }`}
        onClick={() => onSelect(note)}
      >
        <div className="flex items-start gap-2">
          {/* 拖拽手柄 */}
          <button
            {...attributes}
            {...listeners}
            className="mt-1 cursor-grab active:cursor-grabbing text-white/30 hover:text-white/50"
          >
            ⋮⋮
          </button>

          <input
            type="checkbox"
            checked={selectedIds.has(note.id)}
            onChange={(e) => {
              e.stopPropagation();
              onToggleSelect(note.id);
            }}
            className="mt-1 cursor-pointer"
          />

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">
              {note.title}
            </h3>
            {note.summary && (
              <p className="text-xs text-white/50 truncate mt-1">{note.summary}</p>
            )}
            <div className="flex flex-wrap gap-1 mt-2">
              {note.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] rounded border border-[#2a2a2a] px-1.5 py-0.5 text-white/60"
                >
                  {tag}
                </span>
              ))}
              {note.tags.length > 3 && (
                <span className="text-[10px] text-white/40">
                  +{note.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 笔记列表面板
 * 功能：搜索、分类筛选、多选、批量删除、拖拽排序
 */
export default function NotesListPanel({
  notes,
  selectedId,
  onSelect,
  onNew,
  onDelete,
  onReorder,
  categories,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // 筛选笔记
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        !searchQuery ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || note.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [notes, searchQuery, selectedCategory]);

  // 按分类分组（仅在未筛选或查看所有分类时）
  const groupedNotes = useMemo(() => {
    if (selectedCategory !== "all") {
      return [["当前分类", filteredNotes] as [string, LearningNote[]]];
    }

    const map = new Map<string, LearningNote[]>();
    filteredNotes.forEach((note) => {
      const bucket = map.get(note.category) ?? [];
      bucket.push(note);
      map.set(note.category, bucket);
    });
    return Array.from(map.entries());
  }, [filteredNotes, selectedCategory]);

  // 切换选择
  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // 全选/取消全选
  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredNotes.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredNotes.map((n) => n.id)));
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (!confirm(`确认删除选中的 ${selectedIds.size} 条笔记？`)) return;

    for (const id of selectedIds) {
      await onDelete(id);
    }
    setSelectedIds(new Set());
  };

  // 拖拽结束处理
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // 在筛选状态下不允许拖拽排序
    if (searchQuery || selectedCategory !== "all") {
      return;
    }

    // 重新排序所有笔记
    const oldIndex = notes.findIndex((n) => n.id === active.id);
    const newIndex = notes.findIndex((n) => n.id === over.id);

    const newNotes = [...notes];
    const [movedNote] = newNotes.splice(oldIndex, 1);
    newNotes.splice(newIndex, 0, movedNote);

    // 更新 order_index
    const reorderedNotes = newNotes.map((note, index) => ({
      ...note,
      orderIndex: index,
    }));

    onReorder(reorderedNotes);
  };

  return (
    <div className="flex flex-col h-full">
      {/* 头部：新建按钮 */}
      <div className="p-4 border-b border-[#333333]">
        <button
          className="w-full rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-[var(--accent-contrast)] transition hover:brightness-110"
          onClick={onNew}
        >
          + 新建笔记
        </button>
      </div>

      {/* 搜索和筛选 */}
      <div className="p-4 border-b border-[#333333] space-y-3">
        <input
          type="text"
          placeholder="搜索标题或内容..."
          className="w-full rounded-lg border border-[#333333] bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--accent)] transition"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="w-full rounded-lg border border-[#333333] bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--accent)] transition"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">所有分类</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* 批量操作 */}
        {selectedIds.size > 0 && (
          <div className="space-y-2">
            <button
              className="w-full rounded-lg border border-red-400/40 text-red-100 px-3 py-2 text-sm hover:bg-red-400/10 transition"
              onClick={handleBatchDelete}
            >
              删除选中 ({selectedIds.size})
            </button>
            <button
              className="w-full rounded-lg border border-white/20 text-white/70 px-3 py-2 text-sm hover:bg-white/5 transition"
              onClick={() => setSelectedIds(new Set())}
            >
              取消选择
            </button>
          </div>
        )}

        {/* 拖拽提示 */}
        {!searchQuery && selectedCategory === "all" && (
          <p className="text-xs text-white/30">
            💡 拖动 ⋮⋮ 手柄可以重新排序笔记
          </p>
        )}
      </div>

      {/* 全选按钮 */}
      {filteredNotes.length > 0 && (
        <div className="px-4 py-2 border-b border-[#333333] flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedIds.size === filteredNotes.length}
            onChange={handleToggleSelectAll}
            className="cursor-pointer"
          />
          <span className="text-xs text-white/50">
            {selectedIds.size === filteredNotes.length
              ? "已全选"
              : `全选 (${filteredNotes.length})`}
          </span>
        </div>
      )}

      {/* 笔记列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {groupedNotes.length === 0 ? (
          <div className="text-center py-8 text-white/30">
            {searchQuery || selectedCategory !== "all"
              ? "没有找到匹配的笔记"
              : "暂无笔记，点击上方按钮创建"}
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {groupedNotes.map(([category, items]) => (
              <SortableContext
                key={category}
                items={items.map((n) => n.id)}
                strategy={verticalListSortingStrategy}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50 mb-3">
                    {category} ({items.length})
                  </p>
                  <div className="space-y-2">
                    {items.map((note) => (
                      <SortableNoteItem
                        key={note.id}
                        note={note}
                        selectedId={selectedId}
                        selectedIds={selectedIds}
                        onSelect={onSelect}
                        onToggleSelect={handleToggleSelect}
                      />
                    ))}
                  </div>
                </div>
              </SortableContext>
            ))}
          </DndContext>
        )}
      </div>
    </div>
  );
}
