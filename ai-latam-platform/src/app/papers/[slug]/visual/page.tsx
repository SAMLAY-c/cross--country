import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/nav";
import MermaidRenderer from "@/components/mermaid-renderer";
import { DUMMY_PAPERS } from "@/lib/mock-data";
import { MOCK_PAPER_SECTIONS } from "@/lib/mock-paper-sections";

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

export default async function PaperVisualPage({
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

  const slides = [
    {
      id: "intro",
      title: paper.title,
      kicker: "Research Visual",
      bullets: [
        paper.summary ?? "这份演示用于把论文结论转化为可执行的产品策略。",
        "同一套数据，切换演示模式更易理解。",
      ],
      visual: null,
    },
    ...sections.map((section) => ({
      id: `section-${section.section_index}`,
      title: section.title,
      kicker: `Section ${section.section_index + 1}`,
      bullets: section.explanation_md
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("- "))
        .map((line) => line.replace(/^-\s*/, "")),
      visual: section.visuals[0] ?? null,
    })),
  ];

  return (
    <div className="min-h-screen bg-[#05060d] text-white [font-family:var(--font-eco)]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,179,71,0.12),transparent_55%),radial-gradient(circle_at_85%_0%,rgba(76,180,255,0.12),transparent_55%),radial-gradient(circle_at_60%_80%,rgba(48,255,209,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,8,15,0.2),rgba(5,7,18,0.95))]" />
        <main className="relative min-h-screen px-6 pb-16 pt-10 sm:px-10 lg:px-16">
          <Nav currentPath="/papers" />

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                {formatVenue(paper)} · {paper.publishedAt ?? "2024.10.12"}
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl [font-family:var(--font-display)]">
                {paper.title}
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              {paper.slug ? (
                <Link
                  href={`/papers/${paper.slug}`}
                  className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70 transition hover:border-white/30 hover:text-white"
                >
                  Back to Reading
                </Link>
              ) : null}
              {paper.pdfUrl ? (
                <a
                  href={paper.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70 transition hover:border-white/30 hover:text-white"
                >
                  Open PDF
                </a>
              ) : null}
            </div>
          </div>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_280px]">
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6">
              {slides.map((slide, index) => (
                <article
                  key={slide.id}
                  id={slide.id}
                  className="min-w-[85vw] snap-start rounded-3xl border border-white/10 bg-white/5 p-8 sm:min-w-[65vw] lg:min-w-[55vw]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/45">
                    {slide.kicker ?? `Slide ${index + 1}`}
                  </p>
                  <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                    {slide.title}
                  </h2>
                  <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
                    <ul className="space-y-3 text-base leading-relaxed text-white/75">
                      {slide.bullets.map((bullet, bulletIndex) => (
                        <li
                          key={`${slide.id}-${bulletIndex}`}
                          className="fragment rounded-lg border border-white/10 bg-black/20 px-4 py-3"
                          style={{ animationDelay: `${bulletIndex * 0.2}s` }}
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    {slide.visual ? (
                      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                        <MermaidRenderer chart={slide.visual.visual_spec} />
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>

            <aside className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                Slides
              </p>
              <div className="mt-4 space-y-3 text-sm text-white/70">
                {slides.map((slide, index) => (
                  <a
                    key={slide.id}
                    href={`#${slide.id}`}
                    className="block rounded-md border border-white/10 bg-black/20 px-3 py-2 transition hover:border-white/30 hover:text-white"
                  >
                    {index + 1}. {slide.title}
                  </a>
                ))}
              </div>
            </aside>
          </section>
          <style jsx>{`
            .fragment {
              opacity: 0;
              transform: translateY(6px);
              animation: fragment-in 0.5s ease forwards;
            }
            @keyframes fragment-in {
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </main>
      </div>
    </div>
  );
}
