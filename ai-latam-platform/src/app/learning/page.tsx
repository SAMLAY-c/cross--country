import Nav from "@/components/nav";
import { supabase } from "@/lib/supabase";
import {
  RealtimeLearningNotesProvider,
  type LearningNote,
} from "@/components/realtime-learning-notes-provider";
import LearningNotesOverview from "./learning-notes-overview";
import LearningNotesList from "./learning-notes-list";
import { DUMMY_LEARNING_NOTES } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

type LearningNoteRow = {
  id: number;
  title: string;
  slug: string;
  category: string | null;
  summary: string | null;
  tags: string[] | null;
  cover_image: string | null;
  updated_at: string | null;
};

const DUMMY_LEARNING_NOTES_TYPED = DUMMY_LEARNING_NOTES as LearningNote[];

async function getLearningNotes(): Promise<LearningNote[]> {
  const { data, error } = await supabase
    .from("learning_notes")
    .select("id,title,slug,category,summary,tags,updated_at")
    .order("updated_at", { ascending: false });

  if (error || !data?.length) {
    return DUMMY_LEARNING_NOTES_TYPED;
  }

  return (data as LearningNoteRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category || "未分类",
    summary: row.summary || "暂无摘要。",
    tags: Array.isArray(row.tags) ? row.tags : [],
    coverImage: row.cover_image ?? null,
    updatedAt: row.updated_at ?? null,
  }));
}

export default async function LearningPage() {
  const notes = await getLearningNotes();

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

        <main className="relative w-full flex min-h-screen flex-col px-8 pb-20 pt-10 sm:px-12 lg:px-20">
          <Nav currentPath="/learning" />

          <RealtimeLearningNotesProvider
            initialNotes={notes}
            fallbackNotes={DUMMY_LEARNING_NOTES_TYPED}
          >
            <section className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
                  AI TECH
                </p>
                <h1 className="text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl [font-family:var(--font-display)] text-white">
                  把<span className="text-[var(--accent)]">AI技术</span>拆成可检索的笔记，
                  让成长有迹可循。
                </h1>
                <p className="max-w-2xl text-base text-white/60 sm:text-lg leading-relaxed">
                  记录提示词工程、智能体、RAG、LLM 底层等所有探索。按分类整理，直达笔记原文。
                </p>
              </div>
              <LearningNotesOverview />
            </section>

            <section className="mt-16 space-y-12">
              <LearningNotesList />
            </section>
          </RealtimeLearningNotesProvider>
        </main>
      </div>
    </div>
  );
}
