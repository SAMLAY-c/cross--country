import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";

type NavProps = {
  currentPath?: "/tools" | "/prompts" | "/blog" | "/";
};

const linkBase = "hidden sm:inline transition hover:text-amber-100";

export default function Nav({ currentPath }: NavProps) {
  return (
    <nav className="flex items-center justify-between rounded-full bg-[#121f1b]/80 px-6 py-3 text-sm font-medium text-white/85 shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl">
      <div className="flex items-center gap-6">
        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
          AI LATAM Platform
        </span>
        <Link
          className={`${linkBase} ${currentPath === "/tools" ? "text-[var(--accent)]" : ""}`}
          href="/tools"
        >
          工具目录
        </Link>
        <Link
          className={`${linkBase} ${currentPath === "/prompts" ? "text-[var(--accent)]" : ""}`}
          href="/prompts"
        >
          提示词广场
        </Link>
        <Link
          className={`${linkBase} ${currentPath === "/blog" ? "text-[var(--accent)]" : ""}`}
          href="/blog"
        >
          Blog
        </Link>
        <span className="hidden sm:inline">课程</span>
        <span className="hidden sm:inline">资源</span>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button className="rounded-md bg-[var(--accent)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-contrast)] transition hover:brightness-110 hover:shadow-[0_10px_30px_var(--accent-glow)]">
          获取指南
        </button>
      </div>
    </nav>
  );
}
