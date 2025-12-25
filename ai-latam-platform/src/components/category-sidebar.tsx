"use client";

import Link from "next/link";

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

interface CategorySidebarProps {
  notes: LearningNote[];
  currentSlug: string;
  currentCategory: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function CategorySidebar({
  notes,
  currentSlug,
  currentCategory,
}: CategorySidebarProps) {
  if (notes.length === 0) {
    return null;
  }

  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-8 space-y-6 rounded-xl bg-black/20 p-6 border border-white/10">
        {/* 分类标题 */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">
            {currentCategory}
          </h3>
          <p className="text-xs text-white/50">
            共 {notes.length} 篇文章
          </p>
        </div>

        {/* 文章列表 */}
        <nav className="space-y-2">
          {notes.map((note) => {
            const isActive = note.slug === currentSlug;

            return (
              <Link
                key={note.id}
                href={`/learning/${note.slug}`}
                className={`
                  block p-3 rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? "bg-[var(--accent)] text-black font-semibold"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <p className="text-sm line-clamp-2">{note.title}</p>
                {note.updatedAt && (
                  <p className="text-xs mt-1 opacity-60">
                    {formatDate(note.updatedAt)}
                  </p>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
