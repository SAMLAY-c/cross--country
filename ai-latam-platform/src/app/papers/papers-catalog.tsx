"use client";

import { useMemo, useState } from "react";
import StickyFilterBar from "@/components/sticky-filter-bar";

const TOPIC_CATEGORIES = [
  "大模型",
  "检索增强生成",
  "智能体与工具调用",
  "图像生成",
  "视频生成",
  "音频与语音生成",
  "多模态",
  "代码生成",
  "评测与安全",
  "推荐与排序",
  "机器人与具身",
  "异常与预测",
];

export type Paper = {
  id: number;
  title: string;
  authors: string[];
  summary?: string | null;
  abstract?: string | null;
  venue?: string | null;
  year?: number | null;
  primaryCategory?: string | null;
  tags?: string[];
  pdfUrl?: string | null;
  codeUrl?: string | null;
  projectUrl?: string | null;
  coverImage?: string | null;
  publishedAt?: string | null;
};

function formatAuthors(authors?: string[] | null): string {
  if (!authors || authors.length === 0) {
    return "研究团队";
  }
  return authors.join(" · ");
}

function formatVenue(paper: Paper): string {
  if (paper.venue && paper.year) {
    return `${paper.venue} ${paper.year}`;
  }
  if (paper.venue) {
    return paper.venue;
  }
  if (paper.year) {
    return `Preprint ${paper.year}`;
  }
  return "Preprint";
}

export function PaperActions({ paper }: { paper: Paper }) {
  const actions = [
    { label: "PDF", href: paper.pdfUrl },
    { label: "Code", href: paper.codeUrl },
    { label: "Project", href: paper.projectUrl },
  ].filter((item) => item.href);

  if (actions.length === 0) {
    return (
      <span className="inline-flex items-center gap-2 rounded-md bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
        Soon
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <a
          key={action.label}
          href={action.href ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/75 transition hover:border-[var(--accent)] hover:text-white"
        >
          {action.label}
        </a>
      ))}
    </div>
  );
}

function PaperCard({ paper }: { paper: Paper }) {
  return (
    <article className="group relative flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur transition hover:border-white/25">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-white/45">
        <span>{formatVenue(paper)}</span>
        <span>{paper.publishedAt ?? "2024.10.12"}</span>
      </div>
      {paper.primaryCategory ? (
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/55">
          {paper.primaryCategory}
        </span>
      ) : null}
      <h3 className="text-xl font-semibold text-white transition group-hover:text-[var(--accent)]">
        {paper.title}
      </h3>
      <p className="text-sm text-white/65">{formatAuthors(paper.authors)}</p>
      <p className="text-sm text-white/55 leading-relaxed [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] overflow-hidden">
        {paper.summary || paper.abstract || "暂无摘要。"}
      </p>
      <div className="mt-auto flex flex-wrap gap-2">
        {(paper.tags || []).slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60"
          >
            {tag}
          </span>
        ))}
      </div>
      <PaperActions paper={paper} />
    </article>
  );
}

export default function PapersCatalog({ papers }: { papers: Paper[] }) {
  const categories = useMemo(
    () => ["全部", ...TOPIC_CATEGORIES],
    [],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const activeCategory = categories[activeIndex] ?? "全部";

  const filteredPapers = useMemo(() => {
    if (activeCategory === "全部") {
      return papers;
    }
    return papers.filter((paper) => (paper.tags || []).includes(activeCategory));
  }, [activeCategory, papers]);

  return (
    <section className="space-y-8">
      <StickyFilterBar
        items={categories}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
      />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
            Latest Papers
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            {activeCategory === "全部" ? "论文清单" : activeCategory}
          </h2>
        </div>
        <div className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
          {filteredPapers.length} Papers
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPapers.map((paper) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>
    </section>
  );
}
