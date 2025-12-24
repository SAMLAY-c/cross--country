"use client";

import { useRealtimePosts } from "./realtime-posts-provider";

export default function RealtimeFeaturedPost() {
  const { posts } = useRealtimePosts();
  const featured = posts[0];

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-2xl border border-white/10 bg-[#151a18]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1f2937] via-[#0d1714] to-[#000000]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35),rgba(0,0,0,0.9))]" />
      {featured?.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={featured.coverImage}
          alt={featured.title}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
      ) : null}
      <div className="absolute bottom-0 left-0 w-full p-8">
        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.35em] text-[var(--accent)]">
          Featured
        </span>
        <h2 className="text-2xl font-bold text-white transition-colors group-hover:text-[var(--accent)]">
          {featured?.title || "暂无推荐"}
        </h2>
        <div className="mt-3 flex items-center gap-4 text-xs text-white/50">
          <span>{featured?.readTime || "5 Min Read"}</span>
          {featured?.sourceUrl ? (
            <a
              href={featured.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-white/80 transition hover:text-white"
            >
              阅读全文 →
            </a>
          ) : (
            <span className="text-white/50">暂无原文链接</span>
          )}
        </div>
      </div>
    </div>
  );
}
