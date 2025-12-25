"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRealtimeLearningNotes } from "@/components/realtime-learning-notes-provider";

function formatDate(value?: string | null): string {
  if (!value) {
    return "未更新";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "未更新";
  }
  return date
    .toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, ".");
}

export default function LearningNotesList() {
  const { notes } = useRealtimeLearningNotes();
  const buildNoteHref = (note: (typeof notes)[number]) => {
    const safeSlug = note.slug
      .split("-")
      .filter(Boolean)
      .slice(0, 3)
      .join("-");
    return `/learning/${note.id}-${safeSlug || note.id}`;
  };
  const groupedNotes = useMemo(() => {
    const map = new Map<string, typeof notes>();
    notes.forEach((note) => {
      const bucket = map.get(note.category) ?? [];
      bucket.push(note);
      map.set(note.category, bucket);
    });
    return Array.from(map.entries());
  }, [notes]);

  if (!groupedNotes.length) {
    return (
      <div className="rounded-3xl border border-[#333333] bg-[#121212]/80 p-10 text-center text-white/60">
        暂无学习记录。把数据写入 `learning_notes` 表之后这里会自动显示。
      </div>
    );
  }

  return (
    <>
      {groupedNotes.map(([category, items]) => (
        <div key={category} className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                CATEGORY
              </p>
              <h2 className="mt-2 text-3xl font-bold text-white">{category}</h2>
            </div>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
              {items.length} 篇
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 pr-2 snap-x snap-mandatory">
            {items.map((note) => (
              <article
                key={note.id}
                className="flex h-full min-w-[260px] flex-col rounded-2xl border border-[#333333] bg-[#121212] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition hover:-translate-y-1 sm:min-w-[300px] lg:min-w-[340px] snap-start"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                      {note.category}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-white [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
                      {note.title}
                    </h3>
                  </div>
                  <div className="h-16 w-16 overflow-hidden rounded-xl border border-[#333333]">
                    {note.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={note.coverImage}
                        alt={note.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(212,255,0,0.18),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(120,200,255,0.12),transparent_55%),linear-gradient(135deg,#0a0a0a,#121212)] text-xs font-semibold tracking-[0.3em] text-white/60">
                        AI
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-4 text-sm text-white/60 leading-relaxed [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] overflow-hidden">
                  {note.summary}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/50">
                  <span className="rounded-full border border-[#2a2a2a] px-3 py-1">
                    更新 {formatDate(note.updatedAt)}
                  </span>
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#2a2a2a] px-3 py-1 text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={buildNoteHref(note)}
                  className="mt-5 inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/16"
                >
                  查看笔记 →
                </Link>
              </article>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
