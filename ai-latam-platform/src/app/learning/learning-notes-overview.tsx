"use client";

import { useRealtimeLearningNotes } from "@/components/realtime-learning-notes-provider";

export default function LearningNotesOverview() {
  const { notes } = useRealtimeLearningNotes();
  const categories = new Set(notes.map((note) => note.category));

  return (
    <div className="rounded-3xl border border-[#333333] bg-[#121212] p-8 shadow-[0_30px_70px_rgba(0,0,0,0.4)]">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
        概览
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#262626] bg-[#0f0f0f] p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            分类数
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {categories.size}
          </p>
        </div>
        <div className="rounded-2xl border border-[#262626] bg-[#0f0f0f] p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            笔记数
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {notes.length}
          </p>
        </div>
      </div>
      <p className="mt-6 text-sm text-white/60 leading-relaxed">
        按更新时间排序，最新的学习会自动排到最前面。
      </p>
    </div>
  );
}
