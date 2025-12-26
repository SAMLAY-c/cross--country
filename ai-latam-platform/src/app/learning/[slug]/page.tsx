import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/nav";
import MarkdownContent from "@/components/markdown-content";
import { CategorySidebar } from "@/components/category-sidebar";
import { supabase } from "@/lib/supabase";
import { DUMMY_LEARNING_NOTES } from "@/lib/mock-data";

const REVALIDATE_SECONDS = 60 * 5;

export const revalidate = REVALIDATE_SECONDS;

type LearningNoteRow = {
  id: number;
  title: string;
  slug: string;
  category: string | null;
  summary: string | null;
  tags: string[] | null;
  content: string | null;
  updated_at: string | null;
};

type LearningNote = {
  id: number;
  title: string;
  slug: string;
  category: string;
  summary: string;
  tags: string[];
  content: string;
  updatedAt: string | null;
};

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

async function getLearningNote(slug?: string): Promise<LearningNote | null> {
  if (!slug) {
    return null;
  }
  const idMatch = slug.match(/^(\d+)(?:-(.*))?$/);
  const numericId = idMatch ? Number(idMatch[1]) : null;

  const query = supabase
    .from("learning_notes")
    .select("id,title,slug,category,summary,tags,content,updated_at");
  const { data, error } = numericId
    ? await query.eq("id", numericId).maybeSingle()
    : await query.eq("slug", slug).maybeSingle();

  if (error || !data) {
    return null;
  }

  const row = data as LearningNoteRow;

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category || "未分类",
    summary: row.summary || "暂无摘要。",
    tags: Array.isArray(row.tags) ? row.tags : [],
    content: row.content || "暂无正文内容。",
    updatedAt: row.updated_at ?? null,
  };
}

async function getNotesByCategory(category: string): Promise<LearningNote[]> {
  try {
    const { data, error } = await supabase
      .from("learning_notes")
      .select("id,title,slug,category,summary,tags,updated_at")
      .eq("category", category)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      throw new Error("No data found");
    }

    return data.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      category: row.category || "未分类",
      summary: row.summary || "暂无摘要。",
      tags: Array.isArray(row.tags) ? row.tags : [],
      content: "",
      updatedAt: row.updated_at ?? null,
    }));
  } catch {
    // Fallback to mock data
    return DUMMY_LEARNING_NOTES
      .filter((note) => note.category === category)
      .sort((a, b) => {
        const dateA = new Date(a.updatedAt || 0).getTime();
        const dateB = new Date(b.updatedAt || 0).getTime();
        return dateB - dateA;
      })
      .map((note) => ({
        ...note,
        content: "",
      }));
  }
}

export default async function LearningNotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await getLearningNote(slug);

  const fallbackIdMatch = slug.match(/^(\d+)(?:-(.*))?$/);
  const fallbackId = fallbackIdMatch ? Number(fallbackIdMatch[1]) : null;
  const fallback = fallbackId
    ? DUMMY_LEARNING_NOTES.find((item) => item.id === fallbackId)
    : DUMMY_LEARNING_NOTES.find((item) => item.slug === slug);
  const resolvedNote =
    note ??
    (fallback
      ? {
          id: fallback.id,
          title: fallback.title,
          slug: fallback.slug,
          category: fallback.category,
          summary: fallback.summary,
          tags: fallback.tags,
          content: fallback.content,
          updatedAt: fallback.updatedAt ?? null,
        }
      : null);

  if (!resolvedNote) {
    notFound();
  }

  // 获取同分类文章
  const categoryNotes = await getNotesByCategory(resolvedNote.category);

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-[#a1a1aa] [font-family:var(--font-eco)]"
      style={{
        ["--accent" as unknown as string]: "#d4ff00",
        ["--accent-glow" as unknown as string]: "rgba(212,255,0,0.35)",
        ["--accent-contrast" as unknown as string]: "#0a0a0a",
      }}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,255,0,0.12),transparent_60%),radial-gradient(circle_at_15%_10%,rgba(0,255,148,0.12),transparent_55%),radial-gradient(circle_at_85%_25%,rgba(120,200,255,0.12),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,10,10,0.2),rgba(0,0,0,0.7))]" />
        <div className="absolute inset-0 bg-[url('/eco-hero.svg')] bg-cover bg-center opacity-35 grayscale" />
        <div className="brightness-overlay absolute inset-0 bg-white mix-blend-soft-light pointer-events-none" />

        <main className="relative w-full flex min-h-screen flex-col px-4 pb-20 pt-10 sm:px-6 lg:px-8">
          <Nav />

          <div className="mx-auto max-w-7xl w-full">
            <section className="mt-12 space-y-8">
              <Link
                href="/learning"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/60 transition hover:text-[var(--accent)]"
              >
                返回 AI技术
              </Link>

              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
                  {resolvedNote.category}
                </p>
                <h1 className="text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl [font-family:var(--font-display)] text-white">
                  {resolvedNote.title}
                </h1>
                <p className="max-w-3xl text-base text-white/60 sm:text-lg leading-relaxed">
                  {resolvedNote.summary}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-white/50">
                  <span className="rounded-full border border-[#2a2a2a] px-3 py-1">
                    更新 {formatDate(resolvedNote.updatedAt)}
                  </span>
                  {resolvedNote.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#2a2a2a] px-3 py-1 text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* 两栏布局：主内容 + 侧边栏 */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-12">
              {/* 主内容区 - 占3列 */}
              <div className="lg:col-span-3">
                <section>
                  <div className="rounded-3xl border border-[#333333] bg-[#121212]/80 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
                    <MarkdownContent
                      markdown={resolvedNote.content || "暂无正文内容。"}
                    />
                  </div>
                </section>
              </div>

              {/* 侧边栏 - 占1列 */}
              <CategorySidebar
                notes={categoryNotes}
                currentSlug={resolvedNote.slug}
                currentCategory={resolvedNote.category}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
