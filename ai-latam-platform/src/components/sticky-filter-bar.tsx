"use client";

import { useEffect, useRef, useState } from "react";

type StickyFilterBarProps = {
  items: string[];
  activeIndex?: number;
  onSelect?: (index: number) => void;
};

export default function StickyFilterBar({
  items,
  activeIndex = 0,
  onSelect,
}: StickyFilterBarProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} />
      <div
        className={`sticky top-0 z-40 -mx-8 px-8 py-4 backdrop-blur-md transition sm:-mx-12 sm:px-12 lg:-mx-20 lg:px-20 ${
          isStuck
            ? "bg-[#0d0d0d]/95 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
            : "bg-[#0a0a0a]/70"
        }`}
      >
        <div className="flex items-center gap-3 overflow-x-auto text-sm uppercase tracking-[0.25em] text-white/60">
          {items.map((tag, index) => (
            <button
              key={tag}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-sm transition-all ${
                index === activeIndex
                  ? "bg-[var(--accent)] text-[var(--accent-contrast)] font-bold shadow-[0_0_20px_var(--accent-glow)]"
                  : "border border-[#333333] text-white/60 hover:text-white hover:bg-white/5 hover:border-white/30"
              }`}
              type="button"
              onClick={() => onSelect?.(index)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
