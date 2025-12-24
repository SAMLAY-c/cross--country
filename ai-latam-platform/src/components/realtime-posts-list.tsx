"use client";

import { useRealtimePosts } from "./realtime-posts-provider";

export default function RealtimePostsList() {
  const { posts } = useRealtimePosts();

  return (
    <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <article
          key={post.id}
          className="flex h-full flex-col rounded-2xl bg-[#1a2622] p-8 shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition hover:-translate-y-1"
        >
          {post.coverImage ? (
            <div className="mb-4 overflow-hidden rounded-xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-40 w-full object-cover"
              />
            </div>
          ) : (
            <div className="mb-4 flex h-40 items-center justify-center rounded-xl border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(194,247,0,0.25),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(120,200,255,0.18),transparent_55%),linear-gradient(135deg,#0c1411,#16221d)]">
              <span className="text-sm font-semibold tracking-[0.3em] text-white/60">
                AI
              </span>
            </div>
          )}
          {post.gallery?.length ? (
            <div className="mb-4 flex gap-2">
              {post.gallery.slice(0, 3).map((item) => (
                <div
                  key={item}
                  className="h-14 w-14 overflow-hidden rounded-lg border border-white/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-white/45">
            <span>{post.readTime}</span>
            <span>{post.publishedAt}</span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {(() => {
              const parts = post.tag.split(" / ").filter(Boolean);
              const source = parts[0] ?? "AI";
              const keywords = parts.slice(1, 4);
              return (
                <>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-white/50">
                    {source}
                  </span>
                  {keywords.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                </>
              );
            })()}
          </div>
          <h3 className="mt-3 text-xl font-semibold text-white [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
            {post.title}
          </h3>
          <p className="mt-3 text-sm text-white/60 leading-relaxed [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] overflow-hidden">
            {post.excerpt}
          </p>
          {post.sourceUrl ? (
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/16"
            >
              阅读全文 →
            </a>
          ) : (
            <span className="mt-5 inline-flex items-center gap-2 rounded-md bg-white/5 px-4 py-2 text-sm font-semibold text-white/40">
              暂无原文链接
            </span>
          )}
        </article>
      ))}
    </section>
  );
}
