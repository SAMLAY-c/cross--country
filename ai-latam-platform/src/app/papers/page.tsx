import Nav from "@/components/nav";
import { DUMMY_PAPERS } from "@/lib/mock-data";
import PapersCatalog, { PaperActions } from "./papers-catalog";

type Paper = {
  id: number;
  title: string;
  arxivId?: string | null;
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

const DUMMY_PAPERS_TYPED: Paper[] = DUMMY_PAPERS;

export const dynamic = "force-dynamic";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

function formatPublishedAt(value?: string | null): string {
  if (!value) {
    return "2024.10.12";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "2024.10.12";
  }

  return date
    .toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, ".");
}

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

async function getPapers(): Promise<Paper[]> {
  try {
    const response = await fetch(`${API_BASE}/api/papers`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return DUMMY_PAPERS_TYPED;
    }
    const data = (await response.json()) as { papers?: Paper[] };
    if (!data.papers?.length) {
      return DUMMY_PAPERS_TYPED;
    }
    return data.papers.map((row) => ({
      id: row.id,
      title: row.title,
      arxivId: (row as { arxiv_id?: string | null }).arxiv_id ?? null,
      authors: (row as { authors?: string[] | null }).authors ?? [],
      summary: (row as { summary?: string | null }).summary ?? null,
      abstract: (row as { abstract?: string | null }).abstract ?? null,
      venue: (row as { venue?: string | null }).venue ?? null,
      year: (row as { year?: number | null }).year ?? null,
      primaryCategory:
        (row as { primary_category?: string | null }).primary_category ?? null,
      tags: (row as { tags?: string[] | null }).tags ?? [],
      pdfUrl: (row as { pdf_url?: string | null }).pdf_url ?? null,
      codeUrl: (row as { code_url?: string | null }).code_url ?? null,
      projectUrl: (row as { project_url?: string | null }).project_url ?? null,
      coverImage: (row as { cover_image?: string | null }).cover_image ?? null,
      publishedAt: formatPublishedAt(
        (row as { published_at?: string | null }).published_at,
      ),
    }));
  } catch {
    return DUMMY_PAPERS_TYPED;
  }
}

export default async function PapersPage() {
  const papers = await getPapers();
  const [featured, ...rest] = papers;

  return (
    <div
      className="min-h-screen bg-[#07080f] text-[#cbd5f5] [font-family:var(--font-eco)]"
      style={{
        ["--accent" as unknown as string]: "#ffb347",
        ["--accent-glow" as unknown as string]: "rgba(255,179,71,0.35)",
        ["--accent-contrast" as unknown as string]: "#07080f",
      }}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,179,71,0.12),transparent_55%),radial-gradient(circle_at_85%_0%,rgba(76,180,255,0.12),transparent_55%),radial-gradient(circle_at_60%_80%,rgba(48,255,209,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,8,15,0.2),rgba(5,7,18,0.9))]" />
        <div className="absolute inset-0 opacity-30 bg-[url('/eco-hero.svg')] bg-cover bg-center grayscale" />
        <main className="relative w-full flex min-h-screen flex-col gap-16 px-8 pb-20 pt-10 sm:px-12 lg:px-20">
          <Nav currentPath="/papers" />

          <section className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5 space-y-8">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/50">
                Papers
              </p>
              <h1 className="text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl [font-family:var(--font-display)] text-white">
                研究趋势、
                <span className="text-[var(--accent)]">可落地</span>的灵感库
              </h1>
              <p className="max-w-2xl text-base text-white/60 sm:text-lg leading-relaxed">
                聚合关键论文、实验指标与可复现链接，让研究结论直接转化为产品策略。
              </p>
              <div className="flex flex-wrap gap-3">
                {["RAG", "Agent", "VLM", "Inference", "Systems"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/65"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <p className="text-white">重点论文</p>
                  <p className="mt-2 text-2xl text-[var(--accent)]">
                    {papers.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <p className="text-white">追踪领域</p>
                  <p className="mt-2 text-2xl text-[var(--accent)]">12</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              {featured ? (
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,179,71,0.15),transparent_55%),radial-gradient(circle_at_90%_20%,rgba(76,180,255,0.18),transparent_60%)]" />
                  <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div className="space-y-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">
                        Featured Paper
                      </p>
                      <h2 className="text-3xl font-bold text-white">
                        {featured.title}
                      </h2>
                      {featured.primaryCategory ? (
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/55">
                          {featured.primaryCategory}
                        </p>
                      ) : null}
                      <p className="text-sm text-white/65">
                        {formatAuthors(featured.authors)}
                      </p>
                      <p className="text-sm text-white/55 leading-relaxed">
                        {featured.summary ||
                          featured.abstract ||
                          "暂无摘要。"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(featured.tags || []).slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <PaperActions paper={featured} />
                    </div>
                    <div className="relative">
                      <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                          {formatVenue(featured)}
                        </div>
                        <div className="mt-3 text-4xl font-bold text-white">
                          {featured.publishedAt ?? "2024.10.12"}
                        </div>
                        <div className="mt-6 h-40 rounded-xl border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,179,71,0.25),transparent_60%),radial-gradient(circle_at_80%_30%,rgba(76,180,255,0.2),transparent_60%),linear-gradient(135deg,#0b0f1e,#111827)]">
                          {featured.coverImage ? (
                            <div
                              className="h-full w-full rounded-xl bg-cover bg-center"
                              style={{ backgroundImage: `url(${featured.coverImage})` }}
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                              Research Visual
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
          <PapersCatalog papers={rest.length ? rest : papers} />
        </main>
      </div>
    </div>
  );
}
