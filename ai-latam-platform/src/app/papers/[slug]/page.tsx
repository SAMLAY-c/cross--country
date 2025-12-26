import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/nav";
import MarkdownContent from "@/components/markdown-content";
import MermaidRenderer from "@/components/mermaid-renderer";
import { DUMMY_PAPERS } from "@/lib/mock-data";
import { MOCK_PAPER_SECTIONS } from "@/lib/mock-paper-sections";
import { PaperActions } from "../papers-catalog";

type Paper = {
  id: number;
  title: string;
  arxivId?: string | null;
  slug?: string | null;
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

const REVALIDATE_SECONDS = 60 * 60;

export const revalidate = REVALIDATE_SECONDS;

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

function mapPaperResponse(row: any): Paper {
  return {
    id: row.id,
    title: row.title,
    arxivId: row.arxiv_id ?? null,
    slug: row.slug ?? null,
    authors: row.authors ?? [],
    summary: row.summary ?? null,
    abstract: row.abstract ?? null,
    venue: row.venue ?? null,
    year: row.year ?? null,
    primaryCategory: row.primary_category ?? null,
    tags: row.tags ?? [],
    pdfUrl: row.pdf_url ?? null,
    codeUrl: row.code_url ?? null,
    projectUrl: row.project_url ?? null,
    coverImage: row.cover_image ?? null,
    publishedAt: formatPublishedAt(row.published_at ?? null),
  };
}

async function getPaper(slug: string): Promise<Paper | null> {
  try {
    const response = await fetch(`${API_BASE}/api/papers/slug/${slug}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (response.ok) {
      const data = (await response.json()) as Record<string, unknown>;
      return mapPaperResponse(data);
    }
  } catch {
    // fall through to dummy
  }

  const fallback = DUMMY_PAPERS.find((paper) => paper.slug === slug);
  if (!fallback) {
    return null;
  }
  return {
    id: fallback.id,
    title: fallback.title,
    arxivId: fallback.arxivId ?? null,
    slug: fallback.slug ?? null,
    authors: fallback.authors ?? [],
    summary: fallback.summary ?? null,
    abstract: fallback.abstract ?? null,
    venue: fallback.venue ?? null,
    year: fallback.year ?? null,
    primaryCategory: fallback.primaryCategory ?? null,
    tags: fallback.tags ?? [],
    pdfUrl: fallback.pdfUrl ?? null,
    codeUrl: fallback.codeUrl ?? null,
    projectUrl: fallback.projectUrl ?? null,
    coverImage: fallback.coverImage ?? null,
    publishedAt: formatPublishedAt(fallback.publishedAt ?? null),
  };
}

export default async function PaperDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paper = await getPaper(slug);

  if (!paper) {
    notFound();
  }

  const sections = [...MOCK_PAPER_SECTIONS].sort(
    (a, b) => a.section_index - b.section_index
  );

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

          <section className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7 space-y-8">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-white/50">
                Paper Detail
              </p>
              <h1 className="text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl [font-family:var(--font-display)] text-white">
                {paper.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                <span>{formatAuthors(paper.authors)}</span>
                <span>·</span>
                <span>{formatVenue(paper)}</span>
                <span>·</span>
                <span>{paper.publishedAt ?? "2024.10.12"}</span>
              </div>
              <p className="max-w-3xl text-base text-white/60 leading-relaxed">
                {paper.summary || paper.abstract || "暂无摘要。"}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <PaperActions paper={paper} />
                {paper.slug ? (
                  <Link
                    href={`/papers/${paper.slug}/visual`}
                    className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:border-[var(--accent)] hover:text-white"
                  >
                    Research Visual
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,179,71,0.2),transparent_55%)]" />
                <div className="relative space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                    Tags & Context
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(paper.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-4 text-sm text-white/60">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
                      Research Visual
                    </p>
                    <p className="mt-2 leading-relaxed">
                      用结构化讲解与演示模式，把论文结论直接转成可落地策略。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            {sections.map((section) => {
              const visual = section.visuals[0];
              return (
                <article
                  key={section.id}
                  className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                    {section.title}
                  </p>
                  <MarkdownContent markdown={section.explanation_md} />
                  {visual ? (
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <MermaidRenderer chart={visual.visual_spec} />
                    </div>
                  ) : null}
                </article>
              );
            })}
          </section>
        </main>
      </div>
    </div>
  );
}
