"use client";

import { useState } from "react";

const TARGETS = [
  { label: "/tools", path: "/tools" },
  { label: "/prompts", path: "/prompts" },
  { label: "/blog", path: "/blog" },
  { label: "/learning", path: "/learning" },
  { label: "/papers", path: "/papers" },
];

type RevalidateResult = {
  ok: boolean;
  path?: string;
  revalidatedAt?: string;
  error?: string;
};

export default function AdminCachePage() {
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<string, RevalidateResult>>({});

  const handleRevalidate = async (path: string) => {
    setPendingPath(path);
    try {
      const response = await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });

      const result = (await response.json()) as RevalidateResult;
      setStatus((prev) => ({ ...prev, [path]: result }));
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        [path]: {
          ok: false,
          error: error instanceof Error ? error.message : "Request failed",
        },
      }));
    } finally {
      setPendingPath(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e7eb]">
      <main className="mx-auto w-full max-w-4xl px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-[0_30px_70px_rgba(0,0,0,0.4)]">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
            Admin Cache
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-white">
            手动刷新页面缓存
          </h1>
          <p className="mt-2 text-sm text-white/60">
            点击对应页面名称，即刻触发 ISR 重新生成。
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {TARGETS.map((target) => {
              const result = status[target.path];
              const isPending = pendingPath === target.path;
              return (
                <button
                  key={target.path}
                  type="button"
                  onClick={() => handleRevalidate(target.path)}
                  disabled={isPending}
                  className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left text-sm font-semibold uppercase tracking-[0.25em] text-white/80 transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span>{target.label}</span>
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-white/50">
                    {isPending ? "更新中" : "刷新"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 space-y-2 text-xs text-white/60">
            {TARGETS.map((target) => {
              const result = status[target.path];
              if (!result) {
                return null;
              }
              return (
                <div key={`status-${target.path}`}>
                  {result.ok ? (
                    <span>
                      {target.label} 已更新 · {result.revalidatedAt}
                    </span>
                  ) : (
                    <span>
                      {target.label} 更新失败 · {result.error ?? "Unknown error"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
