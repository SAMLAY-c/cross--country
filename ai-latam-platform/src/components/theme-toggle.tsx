"use client";

import { useEffect, useState } from "react";
import { Moon } from "lucide-react";
import clsx from "clsx";

export default function ThemeToggle() {
  const [isBright, setIsBright] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("ui-brightness");
    const shouldBright = saved === "bright";
    setIsBright(shouldBright);
    document.documentElement.dataset.theme = shouldBright ? "bright" : "";
  }, []);

  const toggleBrightness = () => {
    const next = !isBright;
    setIsBright(next);
    document.documentElement.dataset.theme = next ? "bright" : "";
    window.localStorage.setItem("ui-brightness", next ? "bright" : "default");
  };

  return (
    <button
      type="button"
      onClick={toggleBrightness}
      aria-pressed={isBright}
      title="切换亮度"
      className={clsx(
        "inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white transition",
        isBright
          ? "bg-[var(--accent)] text-[var(--accent-contrast)] shadow-[0_8px_24px_var(--accent-glow)]"
          : "hover:bg-white/20"
      )}
    >
      <Moon className="h-4 w-4" />
    </button>
  );
}
